import { InferIdType } from '@/common/types/object-with-id.type';
import { AddProviderToUserPayloadDto } from '@/user/dto/service/payload/add-provider-to-user-payload.dto';
import { CreateUserPayloadDto } from '@/user/dto/service/payload/create-user-payload.dto';
import { findUserByEmailAndExternalProviderPayloadDto } from '@/user/dto/service/payload/find-user-by-email-and-external-provider-payload.dto';
import { User } from '@/user/entities/user.entity';
import { CreateUserReturnType } from '@/user/types/services/return/create-user-return.type';

export interface IUserService {
  createUser: (payload: CreateUserPayloadDto) => Promise<CreateUserReturnType>;
  findUserByEmailAndExternalProvider(
    payload: findUserByEmailAndExternalProviderPayloadDto,
  ): Promise<InferIdType<User, string>>;
  addProviderToUser(payload: AddProviderToUserPayloadDto): Promise<InferIdType<User, string>>;
}
