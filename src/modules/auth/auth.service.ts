import {
  AccountAction,
  APP_DEFAULTS,
  ERROR_RESPONSE,
  getTtlValue,
  hashData,
  JwtTokenType,
  Role,
  ServerException, SuccessResponseDto,
  TokenPayload,
  UserRequestPayload,
  verifyHashed,
} from 'src/common';
import { GoogleAuthService, RedisService } from 'src/integrations';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { appConfiguration, codeExpiresConfiguration, jwtConfiguration } from 'src/config';
import { v4 as uuidv4 } from 'uuid';
import {
  ChangePasswordDto,
  LoginDto,
  LoginResponseDto,
  ResetPasswordDto,
  ForgotPasswordDto,
  SignUpDto,
  SignUpResponseDto,
  VerifyResetPasswordDto,
  VerifyResetPasswordResponseDto,
} from './dto';
import { UserRepository } from 'src/data-access/user';
import { EntityManager, wrap } from '@mikro-orm/core';
import { BaseService } from 'src/modules/base.service';
import { EmailService } from 'src/modules/email';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly googleAuthService: GoogleAuthService,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    @Inject(codeExpiresConfiguration.KEY)
    private readonly codeExpiresConfig: ConfigType<typeof codeExpiresConfiguration>,
    private readonly userRepo: UserRepository,
    private readonly em: EntityManager,
    private readonly emailService: EmailService,
  ) {
    super();
  }

  async login(body: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = body;
    const user = await this.userRepo.findOne({ email });
    if (!user?.password) throw new ServerException(ERROR_RESPONSE.INVALID_CREDENTIALS);
    if (!user.isActive) throw new ServerException(ERROR_RESPONSE.USER_DEACTIVATED);

    const isPasswordValid = await verifyHashed(password, user.password);
    if (!isPasswordValid) {
      throw new ServerException(ERROR_RESPONSE.INVALID_CREDENTIALS);
    }

    return this.manageUserToken(user);
  }

  async signUp(body: SignUpDto): Promise<SignUpResponseDto> {
    const { email, password } = body;
    const existingUser = await this.userRepo.findOne({ email });
    if (existingUser) {
      throw new ServerException(ERROR_RESPONSE.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await hashData(password);

    const user = this.userRepo.create({
      ...body,
      isActive: true,
      emailVerified: false,
      password: hashedPassword,
      role: Role.User
    });

    await this.em.persistAndFlush(user);

    return this.manageUserToken(user);
  }

  async logout(userPayload: UserRequestPayload) {
    const { id, jti } = userPayload;

    const userTokenKey = this.redisService.getUserTokenKey(id, jti);
    await this.redisService.deleteKey(userTokenKey);

    return { success: true };
  }

  async refreshToken(userPayload: UserRequestPayload) {
    const accessToken = await this.generateToken(
      userPayload,
      JwtTokenType.AccessToken,
      this.jwtConfig.accessTokenExpiresIn,
    );

    return { accessToken };
  }

  async sendResetPasswordLink(
    body: ForgotPasswordDto,
  ): Promise<SuccessResponseDto> {
    const { email } = body;
    const user = await this.userRepo.findOne({ email });
    if (!user) throw new ServerException(ERROR_RESPONSE.USER_NOT_FOUND);

    const attempts = await this.redisService.increaseResetAttempts(
      email,
      APP_DEFAULTS.RESET_PASSWORD_WINDOW_SECONDS,
    );

    if (attempts > APP_DEFAULTS.RESET_PASSWORD_MAX_ATTEMPTS) {
      const ttl = await this.redisService.getResetAttemptsTtl(email);
      throw new ServerException(ERROR_RESPONSE.MAXIMUM_EMAIL_RESEND);
    }

    const token = uuidv4();
    const tokenTtl = getTtlValue(this.codeExpiresConfig.resetPassword);

    // Send mail
    const resetPasswordUrl =
      this.appConfig.frontendUrl +
      '/redirect?email=' +
      encodeURIComponent(user.email) +
      '&token=' +
      token +
      '&action=' +
      AccountAction.ResetPassword;
    await this.emailService.forgotPasswordMailer({
      email: email,
      title: 'Reset password',
      fullName: user.fullName,
      resetPasswordUrl: resetPasswordUrl,
    })

    // Save token to redis
    await this.redisService.setValue<string>(
      this.redisService.getResetPasswordKey(user.id),
      token,
      tokenTtl,
    );
    return this.responseSuccess();
  }

  async verifyResetPasswordLink(
    body: VerifyResetPasswordDto,
  ): Promise<VerifyResetPasswordResponseDto> {
    const { email, token } = body;
    const user = await this.userRepo.findOne({ email });
    if (!user) {
      throw new ServerException(ERROR_RESPONSE.USER_NOT_FOUND);
    }

    const isValid = await this.isValidLink(user, token);
    return { isValid };
  }

  async resetPassword(body: ResetPasswordDto): Promise<SuccessResponseDto> {
    const { newPassword, email, token } = body;

    const user = await this.userRepo.findOne({ email });
    if (!user) {
      throw new ServerException(ERROR_RESPONSE.USER_NOT_FOUND);
    }

    const isValidLink = await this.isValidLink(user, token);
    if (!isValidLink) {
      throw new ServerException(ERROR_RESPONSE.LINK_EXPIRED);
    }

    const isSamePassword =
      user.password && (await verifyHashed(newPassword, user.password));
    if (isSamePassword) {
      throw new ServerException(ERROR_RESPONSE.PASSWORD_NOT_CHANGED);
    }

    const hashedPassword = await hashData(newPassword);
    const userData = {
      id: user.id,
      password: hashedPassword,
      passwordChangedAt: new Date(),
    };
    wrap(user).assign(userData);
    await this.em.flush();

    // Update redis
    await this.redisService.deleteKey(this.redisService.getResetPasswordKey(user.id));

    await this.redisService.deleteByPattern(
      this.redisService.getUserTokenPattern(user.id),
    );

    return this.responseSuccess();
  }

  private async manageUserToken(user: any) {
    const jti = uuidv4();
    const tokenPayload = {
      id: user.id,
      jti,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(
        tokenPayload,
        JwtTokenType.AccessToken,
        this.jwtConfig.accessTokenExpiresIn,
      ),
      this.generateToken(
        tokenPayload,
        JwtTokenType.RefreshToken,
        this.jwtConfig.refreshTokenExpiresIn,
      ),
    ]);
    await this.redisService.setValue<string>(
      this.redisService.getUserTokenKey(user.id, jti),
      'deviceId',
      getTtlValue(this.jwtConfig.refreshTokenExpiresIn),
    );

    return { accessToken, refreshToken };
  }

  private async isValidLink(user: any, token: string): Promise<boolean> {
    const cacheKey = this.redisService.getResetPasswordKey(user.id);
    const cachedToken = await this.redisService.getValue<string>(cacheKey);
    return cachedToken === token;
  }

  private async generateToken(
    payload: Partial<TokenPayload>,
    type: JwtTokenType,
    expiresIn: number | string,
  ) {
    const tokenPayload: TokenPayload = {
      id: payload.id,
      email: payload.email,
      jti: payload.jti,
      type,
      role: payload.role,
    };

    const options: Partial<JwtSignOptions> = {
      expiresIn: expiresIn,
    } as unknown as JwtSignOptions;

    return this.jwtService.signAsync(tokenPayload, options);
  }

  async changePassword(
    body: ChangePasswordDto,
    userPayload: UserRequestPayload,
  ): Promise<SuccessResponseDto> {
    const { currentPassword, newPassword } = body;
    const user = await this.userRepo.findOne({ email: userPayload.email });
    if (!user) {
      throw new ServerException(ERROR_RESPONSE.USER_NOT_FOUND);
    }

    const isRightPassword =
      user.password && (await verifyHashed(currentPassword, user.password));
    if (!isRightPassword) {
      throw new ServerException(ERROR_RESPONSE.INVALID_PASSWORD);
    }

    const isSamePassword =
      user.password && (await verifyHashed(newPassword, user.password));
    if (isSamePassword) {
      throw new ServerException(ERROR_RESPONSE.PASSWORD_NOT_CHANGED);
    }

    const hashedPassword = await hashData(newPassword);

    const userData = {
      id: user.id,
      password: hashedPassword,
      passwordChangedAt: new Date(),
    };
    wrap(user).assign(userData);
    await this.em.flush();

    // Update redis
    await this.redisService.deleteKey(this.redisService.getResetPasswordKey(user.id));

    await this.redisService.deleteByPattern(
      this.redisService.getUserTokenPattern(user.id),
    );

    return this.responseSuccess();
  }
}
