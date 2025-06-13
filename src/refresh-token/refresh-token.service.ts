import accessTokenJwtConfig from '@/auth/configs/access-token-jwt.config';
import { EncryptService } from '@/common/services/encrypt/encrypt.service';
import { DateUtil } from '@/common/utils/date.util';
import { DtoUtil } from '@/common/utils/dto.util';
import refreshTokenConfig from '@/refresh-token/configs/refresh-token.config';
import { CreateRefreshTokenDto } from '@/refresh-token/dto/create-refresh-token.dto';
import { RevokeRefreshTokenDto } from '@/refresh-token/dto/revoke-refresh-token.dto';
import { IRefreshTokenService } from '@/refresh-token/interfaces/refresh-token-service.interface';
import { RefreshTokenRepository } from '@/refresh-token/refresh-token.repository';
import { CreateRefreshTokenReturnType } from '@/refresh-token/types/service/return/create-refresh-token-return.type';
import { RefreshTokenReturnType } from '@/refresh-token/types/service/return/refresh-token-return.type';
import { RevokeRefreshTokenReturnType } from '@/refresh-token/types/service/return/revoke-refresh-token-return.type';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    @Inject(accessTokenJwtConfig.KEY)
    private readonly accessTokenJwtConfiguration: ConfigType<typeof accessTokenJwtConfig>,
    @Inject(refreshTokenConfig.KEY)
    private readonly refreshTokenConfiguration: ConfigType<typeof refreshTokenConfig>,
  ) {}

  async createRefreshToken(
    payload: CreateRefreshTokenDto,
  ): Promise<CreateRefreshTokenReturnType | null> {
    await DtoUtil.validateDto(CreateRefreshTokenDto, payload);

    const existingTokenResult = await this.refreshTokenRepository.findNoRevokedTokenByUserId(
      payload.userId,
    );

    if (existingTokenResult) return this.refreshToken(payload);

    const newRefreshToken = await this.jwtService.signAsync(
      payload,
      this.refreshTokenConfiguration,
    );

    const encryptedNewRefreshToken = new EncryptService().encrypt(newRefreshToken);

    const createResult = await this.refreshTokenRepository.create(
      {
        userId: payload.userId,
        token: encryptedNewRefreshToken,
        expiresAt: DateUtil.generateExpiresAtDate(this.refreshTokenConfiguration.expiresIn),
        revoked: false,
      },
      ['token', 'expiresAt', 'revoked'],
    );

    if (!createResult) {
      throw new UnauthorizedException('Refresh token creation failed');
    }

    const accessToken = await this.jwtService.signAsync(payload, this.accessTokenJwtConfiguration);
    const encryptedAccessToken = new EncryptService().encrypt(accessToken);

    if (!accessToken) {
      throw new UnauthorizedException('Failed to generate access token');
    }

    return {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedNewRefreshToken,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
      },
    };
  }

  async refreshToken(payload: CreateRefreshTokenDto): Promise<RefreshTokenReturnType> {
    await DtoUtil.validateDto(CreateRefreshTokenDto, payload);

    const existingTokenResult = await this.refreshTokenRepository.findNoRevokedTokenByUserId(
      payload.userId,
    );

    if (!existingTokenResult) {
      throw new UnauthorizedException('No valid refresh token found for user');
    }

    const newRefreshToken = await this.jwtService.signAsync(
      payload,
      this.refreshTokenConfiguration,
    );
    const encryptedNewRefreshToken = new EncryptService().encrypt(newRefreshToken);

    const updateResult = await this.refreshTokenRepository.updateById(
      existingTokenResult.id,
      {
        token: encryptedNewRefreshToken,
        expiresAt: DateUtil.generateExpiresAtDate(this.refreshTokenConfiguration.expiresIn),
        revoked: false,
      },
      ['token', 'expiresAt', 'revoked'],
    );

    if (!updateResult) {
      throw new UnauthorizedException('Refresh token update failed');
    }

    const tokenPayload = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };

    const newAccessToken = await this.jwtService.signAsync(
      tokenPayload,
      this.accessTokenJwtConfiguration,
    );

    const encryptedNewAccessToken = new EncryptService().encrypt(newAccessToken);

    return {
      accessToken: encryptedNewAccessToken,
      refreshToken: encryptedNewRefreshToken,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
      },
    };
  }

  async revokeRefreshToken(payload: RevokeRefreshTokenDto): Promise<RevokeRefreshTokenReturnType> {
    await DtoUtil.validateDto(RevokeRefreshTokenDto, payload);

    const existingTokenResult = await this.refreshTokenRepository.findNoRevokedTokenByUserId(
      payload.userId,
    );

    if (!existingTokenResult) {
      throw new UnauthorizedException('No valid refresh token found for user');
    }

    const updateResult = await this.refreshTokenRepository.updateById(
      existingTokenResult.id,
      { revoked: true },
      ['token', 'expiresAt', 'revoked'],
    );

    if (!updateResult) {
      throw new UnauthorizedException('Refresh token revocation failed');
    }

    return updateResult;
  }
}
