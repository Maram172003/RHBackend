import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { DetailsEmployeeDto } from './dto/details-employee.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { SubmitDraftDto } from './dto/SubmitDraftDto ';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
  /////////////////////////
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'employees'),
        filename: (req, file, cb) => {
          const unique = randomUUID();
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Patch(':id/details-with-photo')
  async updateDetailsWithPhoto(
    @Param('id') id: string,
    @UploadedFile() photo: Express.Multer.File,
    @Body() body: any,
  ) {
    const details = parseIfString(body.details) ?? {};
    const removePhoto = body.removePhoto === 'true' || body.removePhoto === true;

    if (photo) details.photoUrl = `/uploads/employees/${photo.filename}`;
    if (removePhoto) details.photoUrl = null;

    return this.service.saveDetails(id, details);
  }
  ///////////////////////////

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

  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'employees'),
        filename: (req, file, cb) => {
          const unique = randomUUID();
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('submit')
  submitDraft(
    @UploadedFile() photo: Express.Multer.File,
    @Body() body: any,
  ) {
    const dto = {
      draftToken: body.draftToken,
      details: parseIfString(body.details),
      roles: parseIfString(body.roles),
    };

    return this.service.submitDraft(dto, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }





}
function parseIfString<T = any>(v: any): T | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return undefined; }
  }
  return v;
}
