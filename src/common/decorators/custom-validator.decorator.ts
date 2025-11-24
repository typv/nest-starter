import { Transform } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import dayjs, { UnitType } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

dayjs.extend(isSameOrAfter);

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return false;
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;
          return date.getTime() < Date.now();
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must not be a future date`;
        },
      },
    });
  };
}

export function IsLettersAndSpaces(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAlphaWithSpaces',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return /^[A-Za-z\s]+$/.test(value); // Only letters and spaces
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must contain only alphabetical characters and spaces`;
        },
      },
    });
  };
}

export function IsLettersNumbersAndSpaces(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAlphaNumericWithSpaces',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return /^[A-Za-z0-9\s]+$/.test(value); // letters, numbers, spaces
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must contain only letters, numbers, and spaces`;
        },
      },
    });
  };
}

export function UniquePhoneNumbers(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniquePhoneNumberConstraint,
    });
  };
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPhoneNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(phone: any, args: ValidationArguments) {
          if (typeof phone !== 'string') return false;

          try {
            const phoneUtil = PhoneNumberUtil.getInstance();
            const parsed = phoneUtil.parseAndKeepRawInput(phone);

            // Must be in international format starting with + and valid
            return (
              phoneUtil.isValidNumber(parsed) &&
              phoneUtil.format(parsed, PhoneNumberFormat.E164) === phone
            );
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid phone number`;
        },
      },
    });
  };
}

export function IsGreaterThanOrEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'number' &&
            typeof relatedValue === 'number' &&
            value >= relatedValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be greater than or equal to ${relatedPropertyName}`;
        },
      },
    });
  };
}

export function IsSameDayAs(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isSameDayAs',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) {
            return true;
          }

          return dayjs(value).isSame(dayjs(relatedValue), 'day');
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be on the same day as ${relatedPropertyName}`;
        },
      },
    });
  };
}

@ValidatorConstraint({ async: false })
export class UniquePhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(emergencyContacts: any[], args: ValidationArguments) {
    if (!Array.isArray(emergencyContacts)) return false;
    const phoneNumbers = emergencyContacts.map((c) => c.phoneNumber);
    return phoneNumbers.length === new Set(phoneNumbers).size;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each emergency contact must have a unique phone number.';
  }
}

export function QueryStringToArray() {
  return Transform(({ value }) => {
    return Array.isArray(value) ? value : value ? [value] : [];
  });
}

export function IsDatetimeGreaterThan(
  propertyOrNow: string | 'now',
  allowEquality: boolean = false,
  unit: UnitType = 'day',
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyOrNow, allowEquality, unit],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyOrNow, allowEq, compUnit] = args.constraints;

          if (!(value instanceof Date)) {
            return false;
          }

          let relatedValue: Date;

          if (relatedPropertyOrNow === 'now') {
            relatedValue = new Date();
          } else {
            relatedValue = (args.object as any)[relatedPropertyOrNow];
            if (!(relatedValue instanceof Date)) {
              return false;
            }
          }

          if (allowEq) {
            return dayjs(value).isSameOrAfter(dayjs(relatedValue), compUnit);
          } else {
            return dayjs(value).isAfter(dayjs(relatedValue), compUnit);
          }
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyOrNow, allowEq] = args.constraints;
          const relatedName =
            relatedPropertyOrNow === 'now' ? 'now' : relatedPropertyOrNow;

          if (allowEq) {
            return `${args.property} must be a date on or after ${relatedName}`;
          } else {
            return `${args.property} must be a date after ${relatedName}`;
          }
        },
      },
    });
  };
}

export function IsTimeGreaterThan(
  property: string,
  allowEquality: boolean = false,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTimeGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property, allowEquality],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, allowEq] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          const allDay = (args.object as any)['allDay'];

          if (allDay) {
            return true;
          }

          if (typeof value !== 'string' || typeof relatedValue !== 'string') {
            return false;
          }

          if (allowEq) {
            return value >= relatedValue;
          } else {
            return value > relatedValue;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, allowEq] = args.constraints;
          if (allowEq) {
            return `${args.property} must be a time on or after ${relatedPropertyName}`;
          } else {
            return `${args.property} must be a time after ${relatedPropertyName}`;
          }
        },
      },
    });
  };
}

export function IsDateFormat(format: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [format],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          const date = dayjs(value, args.constraints[0], true);
          return date.isValid();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format ${args.constraints[0]}`;
        },
      },
    });
  };
}
