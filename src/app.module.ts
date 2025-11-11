import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Employee } from './employees/employees.entity';
import { EmployeesModule } from './employees/employees.module';
import { LookupsController } from './lookups/lookups.controller';
import { LookupsModule } from './lookups/lookups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Employee],
      synchronize: true, // pour dev uniquement
    }),
    EmployeesModule,
    AuthModule,
    LookupsModule,
  ],
  controllers: [LookupsController],
})
export class AppModule {}
