import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class ResetAccessCodeDto {
  @ApiProperty({ example: 'OLD123' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  currentAccessCode: string;

  @ApiProperty({ example: 'NEW456' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newAccessCode: string;
}