import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Role } from 'src/auth/roles.enum';
import { DetailsEmployeeDto } from './details-employee.dto';

export class SubmitDraftDto {
    @IsString()
    @IsNotEmpty()
    draftToken: string;

    @ValidateNested()
    @Type(() => DetailsEmployeeDto)
    details: DetailsEmployeeDto;

    @IsArray()
    @IsEnum(Role, { each: true })
    roles: Role[];
}
