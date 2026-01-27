import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Leave } from './leave.entity';
import { In, Repository } from 'typeorm';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { LeaveStatus } from './leave-status.enum';
import { Employee } from 'src/employees/employees.entity';

@Injectable()
export class LeavesService {
  constructor(@InjectRepository(Leave) private readonly repo: Repository<Leave>, @InjectRepository(Employee) private readonly empRepo: Repository<Employee>,) { }

  async create(employeeId: string, dto: CreateLeaveDto, file?: Express.Multer.File) {
    const employee = await this.empRepo.findOne({ where: { id: employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');

    const managerId = employee.lineManagerId;
    if (!managerId) throw new BadRequestException('No line manager assigned to this employee');
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const duration = this.calculateDuration(startDate, endDate);

    const leave = this.repo.create({
      employeeId,
      managerId,
      leaveType: dto.leaveType,
      startDate: dto.startDate,
      endDate: dto.endDate,
      startPart: dto.startPart,
      endPart: dto.endPart,
      duration,
      status: LeaveStatus.Pending,
      attachmentUrl: file ? `/uploads/leaves/${file.filename}` : undefined,
      otherReason: dto.leaveType === 'other' ? dto.otherReason : undefined,
    });

    return this.repo.save(leave);
  }

  private calculateDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);


    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) throw new Error('endDate must be after startDate');

    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays + 1;
  }

  async findByEmployee(employeeId: string) {
    return this.repo.find({
      where: { employeeId },
      order: { createdAt: 'DESC' },
    });
  }


  async findOneForEmployee(employeeId: string, id: string) {
    return this.repo.findOne({
      where: { id, employeeId },
    });
  }

  async updateForEmployee(
    employeeId: string,
    id: string,
    dto: CreateLeaveDto,
    file?: Express.Multer.File,
  ) {
    const leave = await this.repo.findOne({ where: { id, employeeId } });
    if (!leave) return null;

    if (leave.status !== LeaveStatus.Pending) {
      throw new ForbiddenException('You can edit only pending leaves');
    }


    leave.leaveType = dto.leaveType;
    leave.startDate = dto.startDate;
    leave.endDate = dto.endDate;
    leave.startPart = dto.startPart;
    leave.endPart = dto.endPart;
    leave.otherReason = dto.leaveType === 'other' ? dto.otherReason : undefined;


    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    leave.duration = this.calculateDuration(start, end);


    if (file) {
      leave.attachmentUrl = `/uploads/leaves/${file.filename}`;
    }

    return this.repo.save(leave);
  }


  async deleteForEmployee(employeeId: string, id: string) {
    const leave = await this.repo.findOne({ where: { id, employeeId } });
    if (!leave) return false;

    if (leave.status !== LeaveStatus.Pending) {
      throw new ForbiddenException('You can delete only pending leaves');
    }

    await this.repo.remove(leave);
    return true;
  }

  async findByManager(managerId: string) {
    return this.repo.find({
      where: { managerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findTeamLeaves(managerId: string) {
    const team = await this.empRepo.find({
      where: { lineManagerId: managerId, isDraft: false },
      select: ['id', 'firstName', 'lastName', 'email'],
    });

    const ids = team.map(e => e.id);
    if (ids.length === 0) return [];

    const leaves = await this.repo.find({
      where: { employeeId: In(ids) },
      order: { createdAt: 'DESC' },
    });

    const map = new Map(
      team.map(e => [e.id, `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim() || e.email]),
    );

    return leaves.map(l => ({
      ...l,
      employeeId: l.employeeId,
      employeeName: map.get(l.employeeId) ?? l.employeeId,
    }));
  }

  async updateStatusByManager(managerId: string, leaveId: string, status: LeaveStatus) {

    const leave = await this.repo.findOne({ where: { id: leaveId } });
    if (!leave) throw new NotFoundException('Leave not found');


    const emp = await this.empRepo.findOne({
      where: { id: leave.employeeId, lineManagerId: managerId, isDraft: false },
      select: ['id'],
    });
    if (!emp) throw new BadRequestException('Not your team leave');


    leave.status = status;
    await this.repo.save(leave);

    return { ok: true, leave };
  }

  async findAllLeavesForAdmin() {

    const emps = await this.empRepo.find({
      where: { isDraft: false },
      select: ['id', 'firstName', 'lastName', 'email'],
    });

    const map = new Map(
      emps.map(e => [e.id, `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim() || e.email]),
    );


    const leaves = await this.repo.find({
      order: { createdAt: 'DESC' },
    });

    return leaves.map(l => ({
      ...l,
      employeeName: map.get(l.employeeId) ?? l.employeeId,
    }));
  }
  ////////
  private toKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private expandRange(startISO: string, endISO: string): string[] {
    const out: string[] = [];
    const start = new Date(startISO);
    const end = new Date(endISO);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      out.push(this.toKey(d));
    }
    return out;
  }

  private getTunisiaHolidays(year: number): string[] {
    return [
      `${year}-01-01`, // New Year
      `${year}-03-20`, // Independence
      `${year}-04-09`, // Martyrs
      `${year}-05-01`, // Labour
      `${year}-07-25`, // Republic
      `${year}-08-13`, // Women’s Day
      `${year}-10-15`, // Evacuation
      `${year}-12-17`, // Revolution
    ];
  }
  async getBlockedDatesForEmployee(employeeId: string, year: number) {
    const holidays = this.getTunisiaHolidays(year);

    const leaves = await this.repo.find({
      where: {
        employeeId,
        status: In([LeaveStatus.Pending, LeaveStatus.Approved]),
      },
      order: { createdAt: 'DESC' },
    });

   
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;

    const busySet = new Set<string>();
    for (const l of leaves) {
      
      if (l.endDate < yearStart || l.startDate > yearEnd) continue;
      this.expandRange(l.startDate, l.endDate).forEach(d => busySet.add(d));
    }

    const busy = Array.from(busySet);
    const disabled = Array.from(new Set([...holidays, ...busy]));

    return { year, holidays, busy, disabled };
  }

}
