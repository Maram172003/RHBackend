import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsOptional, Length } from 'class-validator';
import { Role } from 'src/auth/roles.enum';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'employee@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Rôles à attribuer ',
    isArray: true,
    enum: Role,
    required: false,
    example: [Role.Employee],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];

}