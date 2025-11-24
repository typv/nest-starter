import { registerAs } from '@nestjs/config';

require('dotenv/config');

export const paymentConfiguration = registerAs('payment', () => ({
  cutoffDate: process.env.PAYMENT_CRON_CUT_OFF_DATE,
  stripeSecret: process.env.PAYMENT_STRIPE_SECRET,
}));
