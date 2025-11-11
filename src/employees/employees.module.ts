import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employees.entity';
import { LookupsController } from 'src/lookups/lookups.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesService],
  controllers: [EmployeesController, LookupsController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
