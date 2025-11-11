import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";
import { StateTN } from "../constants/tunisia";
import { IsCityOfState } from "src/common/validators/is-city-of-state.validator";
import { NATIONALITIES, Nationality } from "../constants/nationalities";
import { CreateEmployeeDto } from "./create-employee.dto";

export enum MaritalStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum ContractType {
  CDI = 'CDI',
  CDD = 'CDD',
  Internship = 'Internship',
  PartTime = 'PartTime',
  Freelance = 'Freelance',
}

export enum Relationship {
  Parent = 'Parent',
  Spouse = 'Spouse',
  Sibling = 'Sibling',
  Friend = 'Friend',
  Other = 'Other',
}


export class DetailsEmployeeDto extends PartialType(CreateEmployeeDto) {

  @ApiProperty()
  @IsString() @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  mobile: string;

  @ApiProperty({ description: 'Date de naissance (ISO 8601)' })
  @IsDateString()
  dob: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Ville correspondant au gouvernorat state' })
  @IsString() 
  @IsCityOfState('state', { message: 'city must belong to the given state' })
  city: string;

  @ApiProperty({ enum: StateTN })
  @IsEnum(StateTN)
  state: StateTN;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  zip: string;

  @ApiPropertyOptional({ enum: MaritalStatus })
  @IsOptional() @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional() @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: 'ISO nationality (ex: Tunisian, French, ...)' })
  @IsOptional()
  @IsIn(NATIONALITIES as readonly string[], { message: 'nationality must be a valid ISO nationality' })
  nationality?: Nationality;


  @ApiProperty()
  @IsString() @IsNotEmpty()
  bankAccountHolder: string;

  @ApiProperty()
  @IsString() @MinLength(10)@IsNotEmpty()
  rib: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  cnss: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  emergencyFirstName: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  emergencyLastName: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  emergencyNumber: string;

  @ApiPropertyOptional({ enum: Relationship })
  @IsOptional() @IsEnum(Relationship)
  relationship?: Relationship;


  @ApiProperty()
  @IsString() @IsNotEmpty()
  department: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  designation: string;

  @ApiProperty({ enum: ContractType })
  @IsEnum(ContractType)
  contractType: ContractType;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  weeklyWork: string;

  @ApiProperty()
  @IsDateString()@IsNotEmpty()
  contractStart: string;

  @ApiProperty()
  @IsDateString()@IsNotEmpty()
  trialEnd: string;

  @ApiProperty()
  @IsNumberString()@IsNotEmpty()
  grossSalary: string;

  @ApiProperty()
  @IsNumberString()@IsNotEmpty()
  grossHourlyRate: string;
}