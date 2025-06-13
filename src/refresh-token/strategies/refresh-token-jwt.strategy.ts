import { JwtPayloadType } from '@/auth/types/strategy/jwt-payload.type';
import { EncryptService } from '@/common/services/encrypt/encrypt.service';
import refreshTokenConfig from '@/refresh-token/configs/refresh-token.config';
import { RefreshTokenRepository } from '@/refresh-token/refresh-token.repository';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token-jwt') {
  constructor(
    @Inject(refreshTokenConfig.KEY)
    private refreshTokenConfiguration: ConfigType<typeof refreshTokenConfig>,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const cookies = req.cookies as { userInfos?: { refreshToken?: string } };
        const refreshToken = cookies?.userInfos?.refreshToken;

        if (!refreshToken) throw new UnauthorizedException('Token not provided');

        const decryptedToken = new EncryptService().decrypt(refreshToken);

        return decryptedToken;
      },
      secretOrKey: refreshTokenConfiguration.secret || 'defaultSecret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayloadType): Promise<JwtPayloadType> {
    const refreshTokenResult = await this.refreshTokenRepository.findNoRevokedTokenByUserId(
      payload?.userId,
    );

    if (!refreshTokenResult) {
      throw new BadRequestException('Refresh token not found or revoked');
    }

    return payload;
  }
}
