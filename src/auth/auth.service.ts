import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly employees: EmployeesService,
    private readonly jwtService: JwtService,
  ) { }

  async validateAndLogin(email: string, accessCode: string) {
    const user = await this.employees.findByEmail(email);
    if (!user || !user.accessCodeHash) throw new UnauthorizedException();

    const ok = await bcrypt.compare(accessCode, user.accessCodeHash);
    if (!ok) throw new UnauthorizedException();

    const payload = { id: user.id, email: user.email, roles: user.roles };
    const token = this.jwtService.sign(payload);
    return { token, mustReset: !!user.mustResetAccessCode };
  }

async resetAccessCode(id: string, currentAccessCode: string, newAccessCode: string) {
  const user = await this.employees.findById(id);
  if (!user || !user.accessCodeHash) throw new UnauthorizedException();

  const ok = await bcrypt.compare(currentAccessCode, user.accessCodeHash);
  if (!ok) throw new UnauthorizedException('Code actuel incorrect');

  await this.employees.setNewAccessCode(id, newAccessCode);

  const token = this.jwtService.sign({ id: user.id, email: user.email, roles: user.roles });
  return { ok: true, token }; 
}
}
