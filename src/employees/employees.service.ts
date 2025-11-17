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
      firstName: dto.firstName ?? emp.firstName ?? null,
      lastName: dto.lastName ?? emp.lastName ?? null,
      mobile: dto.mobile ?? emp.mobile ?? null,
      dob: dto.dob ?? emp.dob ?? null,

      address: dto.address ?? emp.address ?? null,
      state: dto.state ?? emp.state ?? null,
      city: dto.city ?? emp.city ?? null,
      zip: dto.zip ?? emp.zip ?? null,

      maritalStatus: dto.maritalStatus ?? emp.maritalStatus ?? null,
      gender: dto.gender ?? emp.gender ?? null,
      nationality: dto.nationality ?? emp.nationality ?? null,

      bankAccountHolder: dto.bankAccountHolder ?? emp.bankAccountHolder ?? null,
      rib: dto.rib ?? emp.rib ?? null,
      cnss: dto.cnss ?? emp.cnss ?? null,
      emergencyFirstName: dto.emergencyFirstName ?? emp.emergencyFirstName ?? null,
      emergencyLastName: dto.emergencyLastName ?? emp.emergencyLastName ?? null,
      emergencyNumber: dto.emergencyNumber ?? emp.emergencyNumber ?? null,
      relationship: dto.relationship ?? emp.relationship ?? null,

      department: dto.department ?? emp.department ?? null,
      designation: dto.designation ?? emp.designation ?? null,


      contractType: dto.contractType ?? emp.contractType ?? null,
      weeklyWork: dto.weeklyWork ?? emp.weeklyWork ?? null,
      contractStart: dto.contractStart ?? emp.contractStart ?? null,
      trialEnd: dto.trialEnd ?? emp.trialEnd ?? null,

      grossSalary: dto.grossSalary ?? emp.grossSalary ?? null,
      grossHourlyRate: dto.grossHourlyRate ?? emp.grossHourlyRate ?? null,
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

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
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
