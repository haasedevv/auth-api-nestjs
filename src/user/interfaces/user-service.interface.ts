import { InferIdType } from '@/common/types/object-with-id.type';
import { AddProviderToUserPayloadDto } from '@/user/dto/service/payload/add-provider-to-user-payload.dto';
import { CreateUserPayloadDto } from '@/user/dto/service/payload/create-user-payload.dto';
import { findUserByEmailAndExternalProviderPayloadDto } from '@/user/dto/service/payload/find-user-by-email-and-external-provider-payload.dto';
import { User } from '@/user/entities/user.entity';

export interface IUserService {
  createUser: (payload: CreateUserPayloadDto) => Promise<InferIdType<User, string>>;
  findUserByEmailAndExternalProvider(
    payload: findUserByEmailAndExternalProviderPayloadDto,
  ): Promise<InferIdType<User, string>>;
  addProviderToUser(payload: AddProviderToUserPayloadDto): Promise<InferIdType<User, string>>;
}
