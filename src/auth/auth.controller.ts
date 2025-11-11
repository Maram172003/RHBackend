import { Body, Controller, HttpCode, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResetAccessCodeDto } from './dto/reset-access-code.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AuthLoginDto) {
    return await this.auth.validateAndLogin(dto.email, dto.accessCode);

  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer') // 
  @Post('reset-code')
  @HttpCode(200)
  async resetAccessCode(@Req() req, @Body() dto: ResetAccessCodeDto) {
    return this.auth.resetAccessCode(req.user.id, dto.currentAccessCode, dto.newAccessCode);
  }
}