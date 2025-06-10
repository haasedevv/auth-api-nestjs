import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import jwtConfig from '@/auth/configs/jwt.config';
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
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
