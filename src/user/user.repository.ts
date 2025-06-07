import { BaseRepository } from '@/common/repositories/base-repository/base-repository.repository';
import { InferIdType } from '@/common/types/object-with-id.type';
import { MongoDocumentUtil } from '@/common/utils/mongo-document.util';
import { User } from '@/user/entities/user.entity';
import { IUserRepository } from '@/user/interfaces/user-repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(@InjectModel('User') private readonly userBaseRepository: mongoose.Model<User>) {
    super(userBaseRepository);
  }

  async findByEmail(email: string): Promise<InferIdType<User, string> | null> {
    const user = await this.userBaseRepository.findOne({ email }).exec();

    return MongoDocumentUtil.transformDocumentToObjectWithId<User>(user);
  }
}
