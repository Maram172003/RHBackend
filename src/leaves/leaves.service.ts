import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import { Leave } from './leave.entity';
import { Repository } from 'typeorm';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeavesService {
      constructor(@InjectRepository(Leave) private readonly repo: Repository<Leave>) {}

  async create(dto: CreateLeaveDto, userId: string, file?: Express.Multer.File) {
    const leave = this.repo.create({
      ...dto,
      status: 'onhold',                           
      employee: { id: userId } as any,
      attachmentPath: file?.filename ? path.join('uploads', file.filename) : null,
    });

    const saved = await this.repo.save(leave);
    return { ok: true, leave: saved };
  }

  async listForUser(userId: string) {
    return this.repo.find({
      where: { employee: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getByIdForUser(id: string, userId: string) {
    const item = await this.repo.findOne({ where: { id, employee: { id: userId } } });
    if (!item) throw new NotFoundException();
    return item;
  }
}
