import { Employee } from "src/employees/employees.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LeaveStatus } from "./leave-status.enum";
import { LeavePart } from "./leave-part.enum";

@Entity('leaves')
export class Leave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @Column()
  leaveType: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'enum', enum: LeavePart, default: LeavePart.Full })
  startPart: LeavePart;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'enum', enum: LeavePart, default: LeavePart.Full })
  endPart: LeavePart;

  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.Pending })
  status: LeaveStatus;

  @Column({ nullable: true })
  attachmentUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'float', default: 0 })
  duration: number;

  @Column({ type: 'varchar', nullable: true })
  otherReason?: string;

  @Column({ nullable: true })
  managerId?: string;
}