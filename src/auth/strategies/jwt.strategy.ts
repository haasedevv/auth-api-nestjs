import jwtConfig from '@/auth/configs/jwt.config';
import { JwtPayloadType } from '@/auth/types/strategy/jwt-payload.type';
import { UserRepository } from '@/user/user.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY) private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret || 'defaultSecret',
    });
  }

  async validate(payload: JwtPayloadType): Promise<JwtPayloadType> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) throw new UnauthorizedException();

    return payload;
  }
}
