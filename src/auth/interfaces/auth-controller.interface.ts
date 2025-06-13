import { SignInRequestDto } from '@/auth/dto/request/signin-request.dto';
import { ResponseType } from '@/common/types/response.type';
import { Request, Response } from 'express';

export interface IAuthController {
  signin(body: SignInRequestDto, res: Response): Promise<ResponseType<null>>;
  googleSignIn(): void;
  googleCallback(req: Request, res: Response): Promise<ResponseType<null>>;
}
