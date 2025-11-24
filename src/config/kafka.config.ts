import { registerAs } from '@nestjs/config';

export const kafkaConfiguration = registerAs('kafka', () => ({
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : [],
  heartbeatInterval: process.env.KAFKA_HEARTBEAT_INTERVAL || 2000,
  sessionTimeout: process.env.KAFKA_SESSION_TIMEOUT || 60000,
  saslEnabled: process.env.KAFKA_SASL_ENABLED === 'true',
  saslMechanism: process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256',
  saslUsername: process.env.KAFKA_SASL_USERNAME || 'root',
  saslPassword: process.env.KAFKA_SASL_PASSWORD || 'secret',
}));
