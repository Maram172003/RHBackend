import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { Gender, MaritalStatus } from './details-employee.dto';
import { StateTN } from '../constants/tunisia';
import { IsCityOfState } from 'src/common/validators/is-city-of-state.validator';
import { NATIONALITIES, Nationality } from '../constants/nationalities';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional() @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  mobile?: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  @IsOptional() @IsDateString()
  dob?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: StateTN })
  @IsOptional() @IsEnum(StateTN)
  state?: StateTN;

  @ApiPropertyOptional({ description: 'Must belong to state' })
  @IsOptional() @IsString()
  @IsCityOfState('state', { message: 'city must belong to the given state' })
  city?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  zip?: string;

  @ApiPropertyOptional({ enum: MaritalStatus })
  @IsOptional() @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional() @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(NATIONALITIES as readonly string[], { message: 'nationality must be a valid ISO nationality' })
  nationality?: Nationality;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  photoUrl?: string;
}
