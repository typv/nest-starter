import { PropertyDto } from '../decorators';

export class SuccessResponseDto {
  @PropertyDto()
  success: boolean;
}
