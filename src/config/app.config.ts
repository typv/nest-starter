import { registerAs } from '@nestjs/config';
import { NodeEnv } from '../common/enums';

export const getAppConfig = () => ({
  appName: process.env.APP_NAME,
  appPort: +process.env.APP_PORT || 3301,
  nodeEnv: process.env.NODE_ENV as NodeEnv || NodeEnv.Local,
  frontendUrl: process.env.FRONTEND_URL,
  timezone: process.env.TZ || "UTC",
});

export const appConfiguration = registerAs('app', getAppConfig);
