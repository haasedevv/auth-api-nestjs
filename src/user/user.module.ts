import { UserSchema } from '@/user/schemas/user.schema';
import { UserController } from '@/user/user.controller';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserService],
})
export class UserModule {}
