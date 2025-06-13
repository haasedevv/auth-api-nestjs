import accessTokenJwtConfig from '@/auth/configs/access-token-jwt.config';
import refreshTokenConfig from '@/refresh-token/configs/refresh-token.config';
import { RefreshTokenController } from '@/refresh-token/refresh-token.controller';
import { RefreshTokenRepository } from '@/refresh-token/refresh-token.repository';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { RefreshTokenSchema } from '@/refresh-token/schemas/refresh-token.schema';
import { RefreshTokenStrategy } from '@/refresh-token/strategies/refresh-token-jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forFeature(accessTokenJwtConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    MongooseModule.forFeature([{ name: 'RefreshToken', schema: RefreshTokenSchema }]),
  ],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, RefreshTokenRepository, RefreshTokenStrategy, JwtService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
