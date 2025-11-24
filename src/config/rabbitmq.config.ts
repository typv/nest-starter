import { registerAs } from '@nestjs/config';

export const rabbitmqConfiguration = registerAs('rabbitmq', () => ({
  urls: process.env.RABBITMQ_URLS ? process.env.RABBITMQ_URLS.split(',') : [],
}));
