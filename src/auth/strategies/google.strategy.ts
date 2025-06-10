import { AuthService } from '@/auth/auth.service';
import googleOauthConfig from '@/auth/configs/google-oauth.config';
import { HttpException } from '@/common/exceptions/custom/custom.exception';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      ...googleConfiguration,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const validateGoogleUserPayload = {
      email: profile.emails?.[0]?.value || '',
      name: profile.displayName || '',
    };

    if (!validateGoogleUserPayload.email || !validateGoogleUserPayload.name)
      throw new HttpException(null, HttpStatus.BAD_REQUEST, 'Email not provided by Google');

    const user = await this.authService.validateGoogleUser(validateGoogleUserPayload);

    done(null, user);
  }
}
