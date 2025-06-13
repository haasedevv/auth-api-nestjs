import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import accessTokenConfig from '@/auth/configs/access-token-jwt.config';
import githubOauthConfig from '@/auth/configs/github-oauth.config';
import googleOauthConfig from '@/auth/configs/google-oauth.config';
import { GithubAuthGuard } from '@/auth/guards/github-auth.guard';
import { GoogleAuthGuard } from '@/auth/guards/google-auth.guard';
import { AccessTokenJwtStrategy } from '@/auth/strategies/access-token-jwt.strategy';
import { GithubStrategy } from '@/auth/strategies/github.strategy';
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
    ConfigModule.forFeature(githubOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenJwtStrategy,
    GoogleStrategy,
    GoogleAuthGuard,
    GithubStrategy,
    GithubAuthGuard,
  ],
})
export class AuthModule {}
