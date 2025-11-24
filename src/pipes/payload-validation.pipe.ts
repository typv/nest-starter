import { ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { classValidatorExceptionFactory } from '../common/utilities';

interface PayloadValidationPipeOptions extends ValidationPipeOptions {
  protocol: 'http' | 'websocket';
}

export class PayloadValidationPipe extends ValidationPipe {
  constructor(options?: PayloadValidationPipeOptions) {
    super({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: classValidatorExceptionFactory,
      ...options,
    } as ValidationPipeOptions);
  }
}
