import { Public } from 'src/common';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from 'src/guards';

export const RefreshToken = () => applyDecorators(Public(), UseGuards(RefreshTokenGuard));
