import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import accessTokenConfig from '@/auth/configs/access-token-jwt.config';
import googleOauthConfig from '@/auth/configs/google-oauth.config';
import { GoogleAuthGuard } from '@/auth/guards/google-auth.guard';
import { AccessTokenJwtStrategy } from '@/auth/strategies/access-token-jwt.strategy';
import { GoogleStrategy } from '@/auth/strategies/google.strategy';
import { RefreshTokenModule } from '@/refresh-token/refresh-token.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RefreshTokenModule,
    UserModule,
    JwtModule.registerAsync(accessTokenConfig.asProvider()),
    ConfigModule.forFeature(accessTokenConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenJwtStrategy, GoogleStrategy, GoogleAuthGuard],
})
export class AuthModule {}
