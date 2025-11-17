import { Employee } from "src/employees/employees.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('leaves')
export class Leave {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    leaveType: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column()
    startPart: string;

    @Column({ type: 'date' })
    endDate: string;

    @Column()
    endPart: string;


    @Column({ default: 'onhold' })
    status: string;

    @Column({ nullable: true })
    attachmentPath: string | null;

    @ManyToOne(() => Employee, { eager: true, onDelete: 'CASCADE' })
    employee: Employee;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}