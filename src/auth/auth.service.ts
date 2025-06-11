import { SignInPayloadDto } from '@/auth/dto/service/payload/signin-payload.dto';
import { IAuthService } from '@/auth/interfaces/auth-service.interface';
import { SignInReturnType } from '@/auth/types/service/return/sign-in-return.type';
import { UserProvider } from '@/common/enums/user-provider.enum';
import { PasswordService } from '@/common/services/password/password.service';
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
}
