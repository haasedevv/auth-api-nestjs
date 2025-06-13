import { InferIdType } from '@/common/types/object-with-id.type';
import { RefreshToken } from '@/refresh-token/entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  findNoRevokedTokenByUserId(userId: string): Promise<InferIdType<RefreshToken, string> | null>;
}
