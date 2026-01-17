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
}
