import { CreateRefreshTokenDto } from '@/refresh-token/dto/create-refresh-token.dto';
import { RevokeRefreshTokenDto } from '@/refresh-token/dto/revoke-refresh-token.dto';
import { CreateRefreshTokenReturnType } from '@/refresh-token/types/service/return/create-refresh-token-return.type';
import { RefreshTokenReturnType } from '@/refresh-token/types/service/return/refresh-token-return.type';
import { RevokeRefreshTokenReturnType } from '@/refresh-token/types/service/return/revoke-refresh-token-return.type';

export interface IRefreshTokenService {
  createRefreshToken(payload: CreateRefreshTokenDto): Promise<CreateRefreshTokenReturnType | null>;
  refreshToken(payload: CreateRefreshTokenDto): Promise<RefreshTokenReturnType>;
  revokeRefreshToken(payload: RevokeRefreshTokenDto): Promise<RevokeRefreshTokenReturnType>;
}
