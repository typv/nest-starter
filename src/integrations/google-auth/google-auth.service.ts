import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GetTokenOptions } from 'google-auth-library/build/src/auth/oauth2client';

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.client = new OAuth2Client({
      clientId: this.configService.get('google.clientId'),
      clientSecret: this.configService.get('google.clientSecret'),
      redirectUri: this.configService.get('google.redirectUri'),
    });
  }

  async verify(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get('google.clientId'),
      });

      const payload = ticket.getPayload();
      if (!payload?.email_verified) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  async getTokensAndVerify(option: GetTokenOptions) {
    try {
      // Exchange code for tokens
      const { tokens } = await this.client.getToken(option);

      // Verify ID token
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.configService.get('google.clientId'),
      });

      const payload = ticket.getPayload();

      if (!payload?.email_verified) {
        return null;
      }

      return { tokens, payload };
    } catch (error) {
      return null;
    }
  }
}
