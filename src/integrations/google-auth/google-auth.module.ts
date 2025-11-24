import { googleConfiguration } from 'src/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [ConfigModule.forFeature(googleConfiguration)],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
