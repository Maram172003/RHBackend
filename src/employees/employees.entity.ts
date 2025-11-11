import { Role } from 'src/auth/roles.enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ContractType, Gender, MaritalStatus, Relationship } from './dto/details-employee.dto';
import { StateTN } from './constants/tunisia';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;
  
  
  @Column()
  accessCodeHash: string;

  @Column({ default: true })
  mustResetAccessCode: boolean;

    @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.Employee], 
  })
  roles: Role[];

 //

   @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'enum', enum: StateTN, nullable: true })
  state?: StateTN;

 
  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  zip?: string;

  @Column({ type: 'enum', enum: MaritalStatus, nullable: true })
  maritalStatus?: MaritalStatus;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;


  @Column({ nullable: true })
  nationality?: string;

 
  @Column({ type: 'date', nullable: true })
  dob?: string;

  
  @Column({ nullable: true })
  bankAccountHolder?: string;

  @Column({ nullable: true })
  rib?: string;

  @Column({ nullable: true })
  cnss?: string;

  @Column({ nullable: true })
  emergencyNumber?: string;

  @Column({ type: 'enum', enum: Relationship, nullable: true })
  relationship?: Relationship;

  @Column({ nullable: true })
  emergencyFirstName?: string;

  @Column({ nullable: true })
  emergencyLastName?: string;


  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  designation?: string;

  @Column({ nullable: true })
  lineManager?: string;

  @Column({ type: 'enum', enum: ContractType, nullable: true })
  contractType?: ContractType;

 
  @Column({ nullable: true })
  weeklyWork?: string;

  @Column({ type: 'date', nullable: true })
  contractStart?: string;

  @Column({ type: 'date', nullable: true })
  trialEnd?: string;


  @Column({ nullable: true }) grossSalary?: string;
  @Column({ nullable: true }) grossHourlyRate?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}