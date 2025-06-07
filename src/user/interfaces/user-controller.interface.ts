import { ResponseType } from '@/common/types/response.type';
import { CreateUserRequestDto } from '@/user/dto/request/create-user-request.dto';
import { CreateUserReturnType } from '@/user/types/services/return/create-user-return.type';
import { Response } from 'express';

export interface IUserController {
  create: (
    body: CreateUserRequestDto,
    res: Response,
  ) => Promise<ResponseType<CreateUserReturnType>>;
}
