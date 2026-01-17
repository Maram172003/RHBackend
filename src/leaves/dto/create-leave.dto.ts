import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength, ValidateIf } from 'class-validator';
import { LeavePart } from '../leave-part.enum';


export class CreateLeaveDto {
  @IsNotEmpty()
  leaveType: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate: string;

  @IsEnum(LeavePart)
  startPart: LeavePart;

  @IsEnum(LeavePart)
  endPart: LeavePart;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @ValidateIf(o => o.leaveType === 'other')
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  otherReason: string;
}

