import * as Joi from 'joi';
import { JwtAlgorithm, NodeEnv } from '../common/enums';

export const validationSchema = Joi.object({
  //App config validation
  FRONTEND_URL: Joi.string().required(),

  //Database config validation
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_CONNECTION: Joi.string().required(),
  DB_SCHEMA: Joi.string().required(),

  //Google config validation
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_REDIRECT_URI: Joi.string().uri().required(),
  GOOGLE_WEBHOOK_BASE_URL: Joi.string().uri().required(),

  //Redis config validation
  REDIS_URL: Joi.string().uri().required(),

  //JWT config validation
  JWT_SECRET: Joi.string().required(),
  JWT_ALGORITHM: Joi.string()
    .valid(...Object.values(JwtAlgorithm))
    .default(JwtAlgorithm.HS256),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.when('NODE_ENV', {
    is: Joi.string().valid(NodeEnv.Production),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.when('NODE_ENV', {
    is: Joi.string().valid(NodeEnv.Production),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  //AWS SES config validation
  AWS_SES_SENDER: Joi.string().email().required(),
  AWS_SES_REGION: Joi.string().required(),
  AWS_SES_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SES_ACCESS_SECRET_ACCESS_KEY: Joi.string().required(),

  //AWS S3 config validation
  AWS_S3_REGION: Joi.string().required(),
  AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
  AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_S3_URL: Joi.string().uri().required(),

  // Microsoft Outlook OAuth
  MICROSOFT_CLIENT_ID: Joi.string().required(),
  MICROSOFT_CLIENT_SECRET: Joi.string().required(),
  MICROSOFT_REDIRECT_URI: Joi.string().uri().required(),
  // MICROSOFT_WEBHOOK_BASE_URL: Joi.string().uri().required(),

  // Zoom OAuth Configuration
  ZOOM_CLIENT_ID: Joi.string().required(),
  ZOOM_CLIENT_SECRET: Joi.string().required(),
  ZOOM_REDIRECT_URI: Joi.string().uri().required(),
  ZOOM_WEBHOOK_BASE_URL: Joi.string().uri().required(),
  ZOOM_SECRET_TOKEN: Joi.string().required(),

  // Google Service Account
  GOOGLE_SERVICE_CLIENT_EMAIL: Joi.string().email().required(),
  GOOGLE_SERVICE_PRIVATE_KEY: Joi.string().required(),
  GOOGLE_SERVICE_ORGANIZER_EMAIL: Joi.string().email().required(),

  // Microsoft Entra ID Configuration
  MICROSOFT_ENTRA_CLIENT_ID: Joi.string().required(),
  MICROSOFT_ENTRA_CLIENT_SECRET: Joi.string().required(),
  MICROSOFT_ENTRA_TENANT_ID: Joi.string().required(),
  MICROSOFT_ENTRA_ORGANIZER_ID: Joi.string().required(),

  // Zoom Server to Sever
  ZOOM_SERVER_ACCOUNT_ID: Joi.string().required(),
  ZOOM_SERVER_CLIENT_ID: Joi.string().required(),
  ZOOM_SERVER_CLIENT_SECRET: Joi.string().required(),
});
