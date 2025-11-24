import { registerAs } from '@nestjs/config';

export const googleConfiguration = registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  webhookBaseUrl: process.env.GOOGLE_WEBHOOK_BASE_URL,
}));
