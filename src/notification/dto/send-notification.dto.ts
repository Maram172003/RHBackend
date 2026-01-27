import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export enum SendTarget {
  ADMIN = 'ADMIN',
  LINE_MANAGER = 'LINE_MANAGER',
  TEAM = 'TEAM',
}

export class SendNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
