import { SignInRequestDto } from '@/auth/dto/request/signin-request.dto';
import { SignInReturnType } from '@/auth/types/service/return/sign-in-return.type';
import { ResponseType } from '@/common/types/response.type';
import { Response } from 'express';

export interface IAuthController {
  signin(body: SignInRequestDto, res: Response): Promise<ResponseType<SignInReturnType>>;
}
