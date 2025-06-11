import { InferIdType } from '@/common/types/object-with-id.type';
import { AddProviderToUserPayloadDto } from '@/user/dto/service/payload/add-provider-to-user-payload.dto';
import { CreateUserPayloadDto } from '@/user/dto/service/payload/create-user-payload.dto';
import { FindExternalProviderUserPayloadDto } from '@/user/dto/service/payload/find-extermal-provider-user-payload.dto';
import { User } from '@/user/entities/user.entity';
import { CreateUserReturnType } from '@/user/types/services/return/create-user-return.type';

export interface IUserService {
  createUser: (payload: CreateUserPayloadDto) => Promise<CreateUserReturnType>;
  findExternalProviderUser(
    payload: FindExternalProviderUserPayloadDto,
  ): Promise<InferIdType<User, string>>;
  addProviderToUser(payload: AddProviderToUserPayloadDto): Promise<InferIdType<User, string>>;
}
