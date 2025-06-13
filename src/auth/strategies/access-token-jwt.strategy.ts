import accessTokenConfig from '@/auth/configs/access-token-jwt.config';
import { JwtPayloadType } from '@/auth/types/strategy/jwt-payload.type';
import { UserRepository } from '@/user/user.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy, 'AccessTokenJwt') {
  constructor(
    @Inject(accessTokenConfig.KEY)
    private accessTokenConfiguration: ConfigType<typeof accessTokenConfig>,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenConfiguration.secret || 'defaultSecret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayloadType): Promise<JwtPayloadType> {
    const user = await this.userRepository.findById(payload.userId);

    if (!user) throw new UnauthorizedException();

    return payload;
  }
}
