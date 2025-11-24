import { applyDecorators, Logger, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Expose,
  Transform,
  TransformFnParams,
  Type as TransformType,
} from 'class-transformer';
import {
  IsArray,
  isBoolean,
  isBooleanString,
  IsDate,
  isEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import _ from 'lodash';
import { ERROR_RESPONSE } from '../constants';
import { ValidationError } from '../errors';
import { ServerException } from '../../exceptions';

type PropertyType = Type<unknown> | Function | Record<string, any> | 'file';

interface DtoPropertyOptions {
  type: PropertyType;
  structure?: 'array' | 'enum' | 'enumArray' | 'dto' | 'dtoArray';
  validated?: boolean;
  required?: boolean;
  example?: any;
  defaultValue?: any;
  description?: string;
  validateGroup?: string[];
}

/**
 * Comprehensive decorator for DTO's property. Must use everywhere
 * Note:
 * 1. Always validate the property by default
 * 2. When validateGroup is set, payload-validation.pipe is by passed by ValidateIf(() => isValidateByDefault). However, we can operate the validation by using validate()
 * 3. class-transformer always executes before class-validator
 *
 * @param {DtoPropertyOptions} options - The options for the property.
 * @returns The decorators for the property.
 */
function PropertyDto(options?: DtoPropertyOptions) {
  const { structure, validated, validateGroup, ...propertyOptions } = {
    validated: false,
    required: false,
    ...options,
  };
  const isFile = propertyOptions.type === 'file';
  const type = (isFile ? String : propertyOptions.type) as Type<unknown>;
  const isEnum = structure === 'enum' || structure === 'enumArray';
  const isDto = structure === 'dto' || structure === 'dtoArray';
  const isArray =
    structure === 'array' || structure === 'enumArray' || structure === 'dtoArray';
  const example = _.get(propertyOptions, 'defaultValue', propertyOptions.example);

  const decorators: PropertyDecorator[] = [
    Expose(),
    ApiProperty({
      ...propertyOptions,
      type,
      ...(isFile && { format: 'binary' }),
      ...(isEnum && { enum: type, enumName: type.name }),
      isArray,
      example,
      required: propertyOptions.required,
    }),
    ValidateIf(() => isEmpty(validateGroup)), // will not take effect when use validate()
  ];

  // the file is not going through body. It used multer instead (do not validate)
  if (propertyOptions.required && !isFile) {
    decorators.push(IsNotEmpty({ each: isArray, groups: validateGroup }));
  } else {
    decorators.push(IsOptional({ each: isArray, groups: validateGroup }));
  }

  // WARNING developer if type is not supported
  if (_.has(propertyOptions, 'defaultValue')) {
    if (isDto) {
      throw new ValidationError(
        `Property ${type.name} is a DTO but defaultValue set. Please set defaultValue in child DTO instead`,
      );
    }
    if (propertyOptions.required) {
      throw new ValidationError(
        `Property ${type.name} is required but defaultValue set. Please remove defaultValue`,
      );
    }
  }

  // transform all type with default value
  if (_.has(propertyOptions, 'defaultValue')) {
    const setDefaultValue = Transform(({ value }: TransformFnParams) => {
      if (value === undefined) {
        if (!propertyOptions.defaultValue) return;
        return propertyOptions.defaultValue;
      }
      return value;
    });
    decorators.push(setDefaultValue);
  }

  if (isDto) {
    decorators.push(TransformType((obj) => type));
  }

  // validation
  if (!validated) {
    return applyDecorators(...decorators);
  }

  switch (type) {
    case String:
      decorators.push(IsString({ each: isArray, groups: validateGroup }));
      break;
    case Number:
      decorators.push(
        TransformType((obj) => Number),
        IsNumber({}, { each: isArray, groups: validateGroup }),
      );
      break;
    case Date:
      decorators.push(IsDate({ each: isArray, groups: validateGroup }));
      break;
    case Boolean:
      decorators.push(
        Transform((option) => {
          const { value, key } = option;
          if (isEmpty(value)) return;
          if (isBoolean(value)) return value;
          if (!isBooleanString(value)) {
            throw new ServerException({
              ...ERROR_RESPONSE.REQUEST_PAYLOAD_VALIDATION_ERROR,
              message: `Property ${key} is not boolean`,
              details: { isPropertyDto: true, debug: option },
            });
          }
          return value === 'true';
        }),
        TransformType((obj) => String),
      );
      break;
    default:
      if (type && !isEnum && !isDto) {
        Logger.warn(
          `Property type ${type.name} is not Primitive type but are not specified structure (enum, dto)`,
        );
      }
  }

  if (isArray) {
    decorators.push(IsArray({ groups: validateGroup }));
  }
  if (isEnum) {
    decorators.push(IsEnum(type, { each: isArray, groups: validateGroup }));
  }
  if (isArray && !isDto) {
    decorators.push(
      Transform(({ value }) => {
        if (isEmpty(value)) return value;
        if (Array.isArray(value)) return value;
        return [value];
      }),
    );
  }
  if (isDto) {
    decorators.push(
      ValidateNested({
        each: isArray,
        message: (arg) =>
          `Field ${arg.property} with type=${type.name} can not validate nested`,
        groups: validateGroup,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export { PropertyDto };
