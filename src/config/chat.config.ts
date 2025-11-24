import { registerAs } from '@nestjs/config';

export const chatConfiguration = registerAs('chat', () => ({
  apiKey: process.env.STREAM_CHAT_API_KEY,
  apiSecret: process.env.STREAM_CHAT_API_SECRET,
}));
