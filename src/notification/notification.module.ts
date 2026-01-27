import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { Employee } from 'src/employees/employees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, Employee])],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
