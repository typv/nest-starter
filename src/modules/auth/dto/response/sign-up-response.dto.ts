import { PickType } from '@nestjs/swagger';
import { LoginResponseDto } from './login-response.dto';

export class SignUpResponseDto extends PickType(LoginResponseDto, ['accessToken', 'refreshToken'] as const) {}