import { IBaseRepository } from '@/common/interfaces/base-repository.interface';
import { InferIdType } from '@/common/types/object-with-id.type';
import { User } from '@/user/entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<InferIdType<User, string> | null>;
}
