import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Employee } from '../employees/employees.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EmployeesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Employee]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_EXPIRES') },
      }),
    }),
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
