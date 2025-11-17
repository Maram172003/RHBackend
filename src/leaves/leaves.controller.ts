import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { LeavesService } from './leaves.service';


function fileNameFactory(_: any, file: Express.Multer.File, cb: Function) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, unique + extname(file.originalname));
}

@ApiTags('leaves')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard('jwt'))
@Controller('leaves')

@Controller('leaves')
export class LeavesController {
    constructor(private readonly leaves: LeavesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('attachment', {
    storage: diskStorage({
      destination: './uploads',         
      filename: fileNameFactory
    })
  }))
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: CreateLeaveDto,
    @Req() req: any
  ) {
    return this.leaves.create(dto, req.user.id, file);
  }

  @Get('me')
  async listMine(@Req() req: any) {
    return this.leaves.listForUser(req.user.id);
  }
}
