import githubOauthConfig from '@/auth/configs/github-oauth.config';
import { UserProvider } from '@/common/enums/user-provider.enum';
import { UserService } from '@/user/user.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    @Inject(githubOauthConfig.KEY)
    private readonly githubConfiguration: ConfigType<typeof githubOauthConfig>,
    private readonly userService: UserService,
  ) {
    super({
      ...githubConfiguration,
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
      provider: UserProvider.GITHUB,
    };

    if (!validateGoogleUserPayload.email || !validateGoogleUserPayload.name)
      throw new BadRequestException('Email not provided by Google');

    const user =
      await this.userService.findUserByEmailAndExternalProvider(validateGoogleUserPayload);

    done(null, user);
  }
}
