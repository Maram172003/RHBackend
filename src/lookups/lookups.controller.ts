import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { NATIONALITIES } from 'src/employees/constants/nationalities';
import { DEPARTMENTS, DESIGNATIONS_BY_DEPARTMENT } from 'src/employees/constants/org';
import { CitiesByStateTN, StateTN } from 'src/employees/constants/tunisia';
import { ContractType, Gender, MaritalStatus, Relationship } from 'src/employees/dto/details-employee.dto';

@Controller('lookups')
export class LookupsController {
    @Get('states')
    getStates() {
        return Object.values(StateTN);
    }

    @Get('cities')
    getCities(@Query('state') state?: string) {
        if (!state) return [];
        const isValid = (Object.values(StateTN) as string[]).includes(state);
        if (!isValid) throw new BadRequestException('Invalid state');
        return CitiesByStateTN[state as StateTN] ?? [];
    }

    @Get('nationalities')
    getNationalities() {
        return NATIONALITIES;
    }

    @Get('marital-statuses') getMarital() { return Object.values(MaritalStatus); }
    @Get('genders') getGenders() { return Object.values(Gender); }
    @Get('contract-types') getContractTypes() { return Object.values(ContractType); }
    @Get('relationships') getRelationships() { return Object.values(Relationship); }


  @Get('departments')
  getDepartments() {
    return DEPARTMENTS;
  }

  @Get('designations')
  getDesignations(@Query('department') department?: string) {
    if (!department) return [];
    const values = DEPARTMENTS as unknown as string[];
    if (!values.includes(department)) {
      throw new BadRequestException('Invalid department');
    }
    return DESIGNATIONS_BY_DEPARTMENT[department as (typeof DEPARTMENTS)[number]] ?? [];
  }


}
