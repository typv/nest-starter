import { codeExpiresConfiguration, jwtConfiguration } from 'src/config';
import { GoogleAuthModule } from 'src/integrations';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy, RefreshTokenStrategy } from 'src/modules/auth/strategies';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GatewayAuthStrategy } from './strategies/gateway-auth.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/data-access/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfiguration, codeExpiresConfiguration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfiguration)],
      useFactory: async (jwtConfig: ConfigType<typeof jwtConfiguration>) => ({
        global: true,
        secret: jwtConfig.secret,
        signOptions: {
          algorithm: jwtConfig.algorithm,
        },
      }),
      inject: [jwtConfiguration.KEY],
    }),
    MikroOrmModule.forFeature([User]),
    GoogleAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy, RefreshTokenStrategy, GatewayAuthStrategy],
})
export class AuthModule {}
