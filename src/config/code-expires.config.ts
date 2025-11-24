import { registerAs } from '@nestjs/config';
import { APP_DEFAULTS } from '../common/constants';

export const codeExpiresConfiguration = registerAs('codeExpires', () => ({
  verifyEmail:
    process.env.VERIFY_EMAIL_EXPIRES_IN || APP_DEFAULTS.VERIFY_EMAIL_EXPIRES_IN,
  resetPassword:
    process.env.RESET_PASSWORD_EXPIRES_IN || APP_DEFAULTS.RESET_PASSWORD_EXPIRES_IN,
  twoFactorOtp:
    process.env.TWO_FACTOR_OTP_EXPIRES_IN || APP_DEFAULTS.TWO_FACTOR_OTP_EXPIRES_IN,
}));
