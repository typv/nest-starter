import * as dotenv from 'dotenv';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { registerAs } from '@nestjs/config';
import * as entities from 'src/data-access/all.entity';
import { NodeEnv } from 'src/common/enums';

dotenv.config();

export const databaseConfig = {
  driver: PostgreSqlDriver,
  dbName: process.env.DB_DATABASE || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT
    ? Number(process.env.DB_PORT)
    : 5432,
  user: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  schema: process.env.DB_SCHEMA || 'public',
  baseDir: __dirname,
  debug: process.env.NODE_ENV === NodeEnv.Production,
  entities: Object.values(entities),
  cache: {
    enabled: false,
  },
};

export const dbConfiguration = registerAs('database', () => databaseConfig);
