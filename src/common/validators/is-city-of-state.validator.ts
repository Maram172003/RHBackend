import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { CitiesByStateTN, StateTN } from '../../employees/constants/tunisia';

export function IsCityOfState(stateProp: string, validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'isCityOfState',
      target: target.constructor,
      propertyName,
      constraints: [stateProp],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string' || !value.trim()) return false;
          const [statePropName] = args.constraints;
          const stateValue = (args.object as any)[statePropName] as StateTN | undefined;
          if (!stateValue) return false; // state requis avant city
          const allowed = CitiesByStateTN[stateValue] ?? [];
          return allowed.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [statePropName] = args.constraints;
          const stateValue = (args.object as any)[statePropName];
          return `city must be a valid city of state "${stateValue}"`;
        },
      },
    });
  };
}
