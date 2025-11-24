import { jwtConfiguration } from 'src/config';
import { UserRequestPayload } from 'src/common';
import { RedisService } from 'src/integrations';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
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
    const { id, email, jti, type, role } = payload;
    /*if (type !== JwtTokenType.AccessToken)
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
      role,
      emailVerified: true,
    };
  }
}
