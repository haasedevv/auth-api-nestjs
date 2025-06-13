import accessTokenConfig from '@/auth/configs/access-token-jwt.config';
import { SignInPayloadDto } from '@/auth/dto/service/payload/signin-payload.dto';
import { IAuthService } from '@/auth/interfaces/auth-service.interface';
import { SignInReturnType } from '@/auth/types/service/return/sign-in-return.type';
import { UserProvider } from '@/common/enums/user-provider.enum';
import { PasswordService } from '@/common/services/password/password.service';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { UserRepository } from '@/user/user.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(accessTokenConfig.KEY)
    private readonly accessTokenConfiguration: ConfigType<typeof accessTokenConfig>,
  ) {}

  async signIn(payload: SignInPayloadDto): Promise<SignInReturnType> {
    const user = await this.userRepository.findByEmailAndProvider(
      payload.email,
      UserProvider.LOCAL,
    );

    const isValidPassword = await PasswordService.verifyPassword(
      payload.password,
      user?.password || '',
    );

    if (!user || !isValidPassword) throw new UnauthorizedException();

    const refreshTokenPayload = { userId: user.id, email: user.email, name: user.name };
    const createRefreshTokenResult =
      await this.refreshTokenService.createRefreshToken(refreshTokenPayload);

    if (!createRefreshTokenResult) {
      throw new UnauthorizedException('Failed to generate refresh token');
    }

    return createRefreshTokenResult;
  }
}
