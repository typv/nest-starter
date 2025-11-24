import { registerAs } from '@nestjs/config';

export const smtpConfiguration =  registerAs('smtp', () => ({
  smtpHost: process.env.MAIL_HOST,
  smtpPort: parseInt(process.env.MAIL_POST, 587),
  smtpSecure: process.env.MAIL_SECURE === 'true',
  smtpUser: process.env.MAIL_USERNAME,
  smtpPassword: process.env.MAIL_PASSWORD,
  smtpSender: process.env.MAIL_SENDER,
}));
