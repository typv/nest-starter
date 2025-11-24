import { SuccessResponseDto } from 'src/common';

export class BaseService {
  protected responseSuccess(): SuccessResponseDto {
    return { success: true };
  }
}
