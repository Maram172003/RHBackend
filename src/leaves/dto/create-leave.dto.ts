import { IsDateString, IsIn, IsNotEmpty } from 'class-validator';

export class CreateLeaveDto {
  @IsNotEmpty() leaveType: string;
  @IsDateString() startDate: string;
  @IsIn(['full', 'morning', 'afternoon']) startPart: 'full'|'morning'|'afternoon';
  @IsDateString() endDate: string;
  @IsIn(['full', 'morning']) endPart: 'full'|'morning';
}
