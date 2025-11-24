import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { REDIS_CLIENT } from './redis.constant';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService, logger: Logger) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        const redisClient = new IORedis(redisUrl, {
          retryStrategy: () => null,
          maxRetriesPerRequest: null,
        });

        redisClient.on('error', (err) => {
          logger.error({ message: `${err.message}`, context: 'RedisClient' });
        });

        redisClient.on('connect', () => {
          logger.info({
            message: `Redis client connected`,
            context: 'RedisClient',
          });
        });

        // Check redis connection
        try {
          await redisClient.ping();
        } catch (err) {
          throw new Error(err.message);
        }

        return redisClient;
      },
      inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
