export type RevokeRefreshTokenReturnType = {
  id: string;
  token: string;
  expiresAt: Date;
  revoked: boolean;
};
