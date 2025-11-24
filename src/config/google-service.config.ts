import { registerAs } from '@nestjs/config';

export const googleServiceConfiguration = registerAs('googleService', () => ({
  clientEmail: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
  privateKey: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
  organizerEmail: process.env.GOOGLE_SERVICE_ORGANIZER_EMAIL,
}));
