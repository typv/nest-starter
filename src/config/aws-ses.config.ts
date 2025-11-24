import { registerAs } from '@nestjs/config';

export const awsSesConfiguration = registerAs('awsSes', () => ({
  awsSesSender: process.env.AWS_SES_SENDER,
  awsSesRegion: process.env.AWS_SES_REGION,
  awsSesAccessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  awsSesAccessSecretAccessKey: process.env.AWS_SES_ACCESS_SECRET_ACCESS_KEY,
}));
