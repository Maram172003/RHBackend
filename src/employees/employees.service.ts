import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employees.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { generateAndHashAccessCode } from 'src/utils/generate-and-hash';
import { Role } from 'src/auth/roles.enum';
import { DetailsEmployeeDto } from './dto/details-employee.dto';
@Injectable()
export class EmployeesService {

  constructor(@InjectRepository(Employee) private readonly repo: Repository<Employee>) { }

  async create(dto: CreateEmployeeDto) {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Email déjà utilisé');
    }

    const { code, hash } = await generateAndHashAccessCode(6);

    const emp = this.repo.create({
      email: dto.email,
      accessCodeHash: hash,
      mustResetAccessCode: true,
      roles: (dto.roles && dto.roles.length > 0) ? dto.roles : [Role.Employee],

    });

    await this.repo.save(emp);

    return { employee: emp, plainAccessCode: code };
  }

  async findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async setNewAccessCode(employeeId: string, newCode: string) {
    const emp = await this.repo.findOneBy({ id: employeeId });
    if (!emp) throw new NotFoundException('Employé introuvable');

    emp.accessCodeHash = await bcrypt.hash(newCode, 10);
    emp.mustResetAccessCode = false;

    await this.repo.save(emp);
    return emp;
  }
  //

  async saveDetails(id: string, dto: DetailsEmployeeDto) {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    Object.assign(emp, {
      // Personal
      firstName: dto.firstName,
      lastName: dto.lastName,
      mobile: dto.mobile,
      dob: dto.dob,
      maritalStatus: dto.maritalStatus,
      gender: dto.gender,
      nationality: dto.nationality,
      address: dto.address,
      state: dto.state,
      city: dto.city,
      zip: dto.zip,

      bankAccountHolder: dto.bankAccountHolder,
      rib: dto.rib,
      cnss: dto.cnss,
      emergencyFirstName: dto.emergencyFirstName,
      emergencyLastName: dto.emergencyLastName,
      emergencyNumber: dto.emergencyNumber,
      relationship: dto.relationship,
      // Pro
      department: dto.department,
      designation: dto.designation,
      // Contracts
      contractType: dto.contractType,
      weeklyWork: dto.weeklyWork,
      contractStart: dto.contractStart,
      trialEnd: dto.trialEnd,
      grossSalary: dto.grossSalary,
      grossHourlyRate: dto.grossHourlyRate,


    });
    await this.repo.save(emp);
    return { ok: true, employee: emp };
  }
  
  async updateRoles(id: string, roles: Role[]) {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');

    emp.roles = roles && roles.length > 0 ? roles : [Role.Employee];
    await this.repo.save(emp);
    return { ok: true, employee: emp };
  }

  /*
  async updateProfile(id: string, dto: Partial<DetailsEmployeeDto>) {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    Object.assign(emp, dto);
    await this.repo.save(emp);
    return { ok: true, employee: emp };
  }
  
  async markSeen(id: string) {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    (emp as any).seen = true; 
    await this.repo.save(emp);
    return { ok: true };
  }
  
  async remove(id: string) {
    await this.repo.delete(id);
    return { ok: true };
  }
  
  */
}
