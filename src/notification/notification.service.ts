import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/auth/roles.enum';
import { NotificationEntity, NotificationType } from './notification.entity';
import { SendNotificationDto, SendTarget } from './dto/send-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employees/employees.entity';
import { Repository } from 'typeorm';



@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity) private notifRepo: Repository<NotificationEntity>,
        @InjectRepository(Employee) private empRepo: Repository<Employee>,
    ) { }


    async getMyNotifications(employeeId: string) {
        return this.notifRepo.find({
            where: { recipientId: employeeId },
            order: { createdAt: 'DESC' },
            take: 80,
        });
    }



    async send(senderId: string, dto: SendNotificationDto) {
        const sender = await this.empRepo.findOne({ where: { id: senderId } });
        if (!sender) throw new NotFoundException('Sender not found');

        const recipient = await this.empRepo.findOne({ where: { id: dto.recipientId } });
        if (!recipient) throw new NotFoundException('Recipient not found');

        if (dto.recipientId === senderId) {
            throw new BadRequestException('You cannot send a message to yourself');
        }

        const notif = this.notifRepo.create({
            senderId,
            recipientId: dto.recipientId,
            title: dto.title?.trim(),
            message: dto.message?.trim(),
            type: NotificationType.MSG,
            readAt: null, 
        });

        return this.notifRepo.save(notif);
    }
    async searchUsers(senderId: string, q: string) {
        const term = q.trim();
        if (!term || term.length < 2) return [];

        return this.empRepo
            .createQueryBuilder('e')
            .select(['e.id', 'e.firstName', 'e.lastName'])
            .where('e.id <> :me', { me: senderId })
            .andWhere(
                `(e.firstName ILIKE :q OR e.lastName ILIKE :q OR CONCAT(e.firstName,' ',e.lastName) ILIKE :q)`,
                { q: `%${term}%` }
            )
            .take(10)
            .getMany();
    }
    async getRecipients(employeeId: string) {

        return this.empRepo
            .createQueryBuilder('e')
            .select(['e.id', 'e.firstName', 'e.lastName'])
            .where('e.id <> :me', { me: employeeId })
            .orderBy('e.firstName', 'ASC')
            .take(200)
            .getMany();
    }

    async markAsRead(userId: string, notifId: string) {
        const n = await this.notifRepo.findOne({ where: { id: notifId } });
        if (!n) throw new NotFoundException('Notification not found');
        if (n.recipientId !== userId) throw new ForbiddenException('Not yours');

        n.readAt = new Date();
        return this.notifRepo.save(n);
    }


}
