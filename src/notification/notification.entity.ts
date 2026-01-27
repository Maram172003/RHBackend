import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum NotificationType {
  MSG = 'MSG',
  LEAVE = 'LEAVE',
}

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.MSG })
  type: NotificationType;

  @Index()
  @Column({ type: 'uuid' })
  recipientId: string;

  @Index()
  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  readAt?: Date | null;
}
