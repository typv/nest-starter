import { PropertyDto } from 'src/common';
import { IsStrongPassword, Matches, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: 'Sota@001',
  })
  @MaxLength(50)
  currentPassword: string;

  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: 'Sota@123',
  })
  @MaxLength(50)
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Matches(/^\S+$/, {
    message: 'Whitespace not allowed',
  })
  newPassword: string;
}