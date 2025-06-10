import { SignInPayloadDto } from '@/auth/dto/service/payload/signin-payload.dto';
import { ValidateGoogleUserPayloadDto } from '@/auth/dto/service/payload/validate-google-user.dto';
import { IAuthService } from '@/auth/interfaces/auth-service.interface';
import { SignInReturnType } from '@/auth/types/service/return/sign-in-return.type';
import { ValidateGoogleUserReturnType } from '@/auth/types/service/return/validate-google-user-return.type';
import { UserProvider } from '@/common/enums/user-provider.enum';
import { HttpException } from '@/common/exceptions/custom/custom.exception';
import { PasswordService } from '@/common/services/password/password.service';
import { InferIdType } from '@/common/types/object-with-id.type';
import { User } from '@/user/entities/user.entity';
import { UserRepository } from '@/user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
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

    const jwtPayload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return {
      accessToken: accessToken,
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async validateGoogleUser(
    payload: ValidateGoogleUserPayloadDto,
  ): Promise<ValidateGoogleUserReturnType> {
    let user: InferIdType<User, string> | null = null;

    user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      const createUserPayload = {
        email: payload.email,
        name: payload.name,
        password: '',
        providers: [UserProvider.GOOGLE],
      };

      user = await this.userRepository.create(createUserPayload, ['email', 'name', 'providers']);
    }

    if (user && !user?.providers?.includes(UserProvider.GOOGLE)) {
      user = await this.userRepository.updateById(
        user.id,
        {
          ...user,
          providers: [...user.providers, UserProvider.GOOGLE],
        },
        ['email', 'name', 'providers'],
      );
    }

    if (!user) throw new HttpException(null, 400, 'User validation failed');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
