import { registerAs } from '@nestjs/config';
import { StrategyOptions } from 'passport-github2';

export default registerAs(
  'github-oauth',
  (): StrategyOptions => ({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.GITHUB_CALLBACK_URL || '',
    scope: ['user:email'],
  }),
);
