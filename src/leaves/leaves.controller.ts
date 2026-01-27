import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { extname, join } from 'path';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { LeavesService } from './leaves.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LeaveStatus } from './leave-status.enum';



@ApiTags('Leaves')
@ApiBearerAuth('bearer')
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leaves: LeavesService) { }


  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  my(@Req() req: any) {
    const employeeId = (req.user?.id ?? req.user?.sub) as string;
    return this.leaves.findByEmployee(employeeId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('team')
  team(@Req() req: any) {
    const managerId = (req.user?.id ?? req.user?.sub) as string;


    const roleRaw = req.user?.role ?? req.user?.roles;
    const role = Array.isArray(roleRaw) ? roleRaw[0] : roleRaw;
    const roleLc = (role ?? '').toString().toLowerCase();


    if (roleLc === 'admin') {
      return this.leaves.findAllLeavesForAdmin();
    }


    return this.leaves.findTeamLeaves(managerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        leaveType: { type: 'string' },
        startDate: { type: 'string', example: '2026-01-14' },
        endDate: { type: 'string', example: '2026-01-16' },
        startPart: { type: 'string', enum: ['full', 'morning', 'afternoon'] },
        endPart: { type: 'string', enum: ['full', 'morning', 'afternoon'] },
        attachment: { type: 'string', format: 'binary' },
      },
      required: ['leaveType', 'startDate', 'endDate', 'startPart', 'endPart'],
    },
  })
  @UseInterceptors(
    FileInterceptor('attachment', {
      storage: diskStorage({
        destination: 'uploads/leaves',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @Req() req: any,
    @Body() dto: CreateLeaveDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const employeeId = (req.user?.id ?? req.user?.sub) as string;

    if (!dto.leaveType) throw new BadRequestException('leaveType is required');

    const leave = await this.leaves.create(employeeId, dto, file);
    return { ok: true, leave };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('blocked')
  blocked(@Req() req: any, @Query('year') year?: string) {
    const employeeId = (req.user?.id ?? req.user?.sub) as string;
    const y = year ? Number(year) : new Date().getFullYear();
    return this.leaves.getBlockedDatesForEmployee(employeeId, y);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getOne(@Req() req: any, @Param('id') id: string) {
    const employeeId = (req.user?.id ?? req.user?.sub) as string;

    const leave = await this.leaves.findOneForEmployee(employeeId, id);
    if (!leave) throw new NotFoundException('Leave not found');

    return leave;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('attachment', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'leaves'),
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: CreateLeaveDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const employeeId = (req.user?.id ?? req.user?.sub) as string;

    const updated = await this.leaves.updateForEmployee(employeeId, id, dto, file);
    if (!updated) throw new NotFoundException('Leave not found');

    return { ok: true, leave: updated };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const employeeId = (req.user?.id ?? req.user?.sub) as string;

    const ok = await this.leaves.deleteForEmployee(employeeId, id);
    if (!ok) throw new NotFoundException('Leave not found');

    return { ok: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: LeaveStatus },
  ) {
    const managerId = (req.user?.id ?? req.user?.sub) as string;
    return this.leaves.updateStatusByManager(managerId, id, body.status);
  }


}
