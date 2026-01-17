import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employees.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { generateAndHashAccessCode } from 'src/utils/generate-and-hash';
import { Role } from 'src/auth/roles.enum';
import { DetailsEmployeeDto } from './dto/details-employee.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SubmitDraftDto } from './dto/SubmitDraftDto ';
import { randomUUID } from 'crypto';

type EmployeeDraft = {
  email: string;
  accessCodeHash: string;
  plainAccessCode: string;
};

@Injectable()

export class EmployeesService {


  constructor(@InjectRepository(Employee) private readonly repo: Repository<Employee>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,) { }



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
    const emp = await this.repo.findOneBy({ id });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
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
    if (dto.email !== undefined) {
      const normalized = String(dto.email).trim().toLowerCase();

      const existing = await this.repo.findOne({ where: { email: normalized } });

      // email déjà pris par un autre employee
      if (existing && existing.id !== id) {
        throw new ConflictException('This email is already used');
      }

      emp.email = normalized;
    }


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

      lineManagerId: dto.lineManagerId ?? emp.lineManagerId ?? null,
      photoUrl: dto.photoUrl ?? emp.photoUrl ?? null,
    });
    emp.isDraft = false;
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

  async createDraft(email: string) {
    const normalized = email.trim().toLowerCase();
    const exists = await this.repo.findOne({ where: { email: normalized } });
    if (exists) throw new ConflictException('Email déjà utilisé');

    const { code, hash } = await generateAndHashAccessCode(6);
    const draftToken = randomUUID();
    const key = `employee-draft:${draftToken}`;
    await this.cache.set(
      key,
      {
        email: normalized, accessCodeHash: hash, plainAccessCode: code
      },
      60 * 60 * 1000
    );
    const test = await this.cache.get(key);
    console.log('DRAFT SAVED ?', !!test, key);

    return { draftToken, plainAccessCode: code };
  }

  async deleteDraft(token: string) {
    await this.cache.del(`employee-draft:${token}`);
    return { ok: true };
  }

  async submitDraft(dto: SubmitDraftDto, photo?: Express.Multer.File) {
    console.log('SUBMIT token =', dto.draftToken);
    const key = `employee-draft:${dto.draftToken}`;

    const draft = await this.cache.get<any>(key);
    console.log('DRAFT FOUND ?', !!draft, key);
    if (!draft) throw new BadRequestException('Draft expired or invalid');

    const employee = this.repo.create({
      email: draft.email,
      accessCodeHash: draft.accessCodeHash,
      mustResetAccessCode: true,
      roles: dto.roles?.length ? dto.roles : [Role.Employee],
      isDraft: false,
    });

    const saved = await this.repo.save(employee);
    if (photo) {
      dto.details = dto.details ?? ({} as any);
      (dto.details as any).photoUrl = `/uploads/employees/${photo.filename}`;
    }

    if (dto.details) {
      if (photo) {
        dto.details.photoUrl = `/uploads/employees/${photo.filename}`;
      }
      await this.saveDetails(saved.id, dto.details);
    }
    if (dto.roles) {
      await this.updateRoles(saved.id, dto.roles);
    }

    await this.cache.del(key);

    const fresh = await this.repo.findOneBy({ id: saved.id });
    return { employee: fresh, plainAccessCode: draft.plainAccessCode };
  }
  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }


}
