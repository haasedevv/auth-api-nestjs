import { SignInPayloadDto } from '@/auth/dto/service/payload/signin-payload.dto';
import { SignInReturnType } from '@/auth/types/service/return/sign-in-return.type';

export interface IAuthService {
  signIn(payload: SignInPayloadDto): Promise<SignInReturnType>;
}
