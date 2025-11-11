import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ example: 'employee@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ABC123' })
  @IsString()
  @IsNotEmpty()
  accessCode: string;
}