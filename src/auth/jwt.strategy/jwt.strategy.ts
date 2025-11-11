// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../roles.enum';

type JwtPayload = { id: string; email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly cfg: ConfigService) {
    const secret = cfg.get<string>('JWT_SECRET');   
    if (!secret) {
      throw new Error('JWT_SECRET manquant (vérifie ton .env)');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,                           
    });
  }

async validate(payload: { id: string; email: string; roles: Role[] }) {
  return { id: payload.id, email: payload.email, roles: payload.roles };
}
}
