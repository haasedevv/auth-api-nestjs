import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import googleOauthConfig from '@/auth/configs/google-oauth.config';
import jwtConfig from '@/auth/configs/jwt.config';
import { GoogleAuthGuard } from '@/auth/guards/google-auth.guard';
import { GoogleStrategy } from '@/auth/strategies/google.strategy';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GoogleAuthGuard],
})
export class AuthModule {}
