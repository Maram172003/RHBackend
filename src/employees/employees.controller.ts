import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { DetailsEmployeeDto } from './dto/details-employee.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { SubmitDraftDto } from './dto/SubmitDraftDto ';

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

  @Get()
  @ApiOperation({ summary: 'Lister tous les employés' })
  findAll() {
    return this.service.findAll();
  }

  @Post('draft')
  createDraft(@Body() dto: { email: string }) {
    return this.service.createDraft(dto.email);
  }


  @Delete('draft/:token')
  deleteDraft(@Param('token') token: string) {
    return this.service.deleteDraft(token);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post('submit')
  submit(@Body() dto: SubmitDraftDto) {
    return this.service.submitDraft(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

}
