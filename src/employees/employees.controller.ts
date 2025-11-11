import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { DetailsEmployeeDto } from './dto/details-employee.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) { }

  @Post()
  @ApiOperation({ summary: 'Créer un employé et générer un code d’accès' })
  async create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }


  @Post(':id/details')
  @ApiOperation({ summary: 'SUBMIT: enregistrer toutes les infos (onboarding)' })
  async saveDetails(@Param('id') id: string, @Body() dto: DetailsEmployeeDto) {
    return this.service.saveDetails(id, dto);
  }

  @Patch(':id/roles')
  @ApiOperation({ summary: 'Mettre à jour les rôles (dernier onglet)' })
  updateRoles(@Param('id') id: string, @Body() dto: UpdateRolesDto) {
    return this.service.updateRoles(id, dto.roles);
  }
  /*
      @Patch(':id/profile')
    @ApiOperation({ summary: 'Mettre à jour le profil (plus tard)' })
    updateProfile(@Param('id') id: string, @Body() dto: Partial<DetailsEmployeeDto>) {
      return this.service.updateProfile(id, dto);
    }
  
    @Patch(':id/seen')
    @ApiOperation({ summary: 'Marquer comme vu (seen)' })
    markSeen(@Param('id') id: string) {
      return this.service.markSeen(id);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un employé' })
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
      */
}
