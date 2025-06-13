import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs('accessTokenJwt', (): JwtSignOptions => {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRES_IN)
    throw new Error('Missing environment variables for refresh token configuration');

  return {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    secret: process.env.REFRESH_TOKEN_SECRET,
  };
});
