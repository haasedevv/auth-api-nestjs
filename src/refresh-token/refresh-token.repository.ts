import { BaseRepository } from '@/common/repositories/base-repository/base-repository.repository';
import { InferIdType } from '@/common/types/object-with-id.type';
import { MongoDocumentUtil } from '@/common/utils/mongo-document.util';
import { RefreshToken } from '@/refresh-token/entities/refresh-token.entity';
import { IRefreshTokenRepository } from '@/refresh-token/interfaces/refresh-token-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class RefreshTokenRepository
  extends BaseRepository<RefreshToken>
  implements IRefreshTokenRepository
{
  constructor(
    @InjectModel('RefreshToken')
    private readonly refreshTokenRepository: mongoose.Model<RefreshToken>,
  ) {
    super(refreshTokenRepository);
  }

  async findNoRevokedTokenByUserId(
    userId: string,
  ): Promise<InferIdType<RefreshToken, string> | null> {
    const findedTokenResult = await this.refreshTokenRepository
      .findOne({
        userId,
        revoked: false,
        expiresAt: { $gt: new Date() },
      })
      .exec();

    return MongoDocumentUtil.transformDocumentToObjectWithId<RefreshToken>(findedTokenResult);
  }
}
