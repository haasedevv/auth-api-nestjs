import { CreateUserPayloadDto } from '@/user/dto/service/payload/create-user-payload.dto';
import { CreateUserReturnType } from '@/user/types/services/return/create-user-return.type';

export interface IUserService {
  createUser: (payload: CreateUserPayloadDto) => Promise<CreateUserReturnType>;
}
