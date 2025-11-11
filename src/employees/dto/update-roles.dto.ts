import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/auth/roles.enum';

export class UpdateRolesDto {
  @ApiProperty({ isArray: true, enum: Role, example: [Role.Employee] })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[];
}