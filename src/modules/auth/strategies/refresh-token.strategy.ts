import {
  ERROR_RESPONSE,
  JwtTokenType,
  ServerException,
  UserRequestPayload,
} from 'src/common';
import { RedisService } from 'src/integrations';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfiguration } from 'src/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private redisService: RedisService,
    @Inject(jwtConfiguration.KEY)
    private jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any): Promise<UserRequestPayload> {
    const { id, email, jti, type } = payload;
    /*if (type !== JwtTokenType.RefreshToken)
      throw new ServerException(ERROR_RESPONSE.INVALID_TOKEN_USAGE);

    // Check valid token
    const userTokenKey = this.redisService.getUserTokenKey(id, jti);
    const isTokenValid = await this.redisService.getValue<string>(userTokenKey);
    if (!isTokenValid) throw new ServerException(ERROR_RESPONSE.UNAUTHORIZED);

    const user = await this.userRepo.findOne({ id });
    if (!user) throw new ServerException(ERROR_RESPONSE.USER_NOT_FOUND);
    if (!user.isActive) throw new ServerException(ERROR_RESPONSE.USER_DEACTIVATED);
    */

    return {
      id,
      email,
      jti,
    };
  }
}
