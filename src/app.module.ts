import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Employee } from './employees/employees.entity';
import { EmployeesModule } from './employees/employees.module';
import { LookupsController } from './lookups/lookups.controller';
import { LookupsModule } from './lookups/lookups.module';
import { LeavesModule } from './leaves/leaves.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 1800,
      isGlobal: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Employee],

      synchronize: true,
      autoLoadEntities: true,
    }),
    EmployeesModule,
    AuthModule,
    LookupsModule,
    LeavesModule
  ],
  controllers: [LookupsController],
})
export class AppModule { }
