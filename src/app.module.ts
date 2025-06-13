import { AuthModule } from '@/auth/auth.module';
import { RefreshTokenModule } from '@/refresh-token/refresh-token.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),

    UserModule,
    AuthModule,
    RefreshTokenModule,
  ],
})
export class AppModule {}
