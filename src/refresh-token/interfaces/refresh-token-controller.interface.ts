import { ResponseType } from '@/common/types/response.type';
import { Request, Response } from 'express';

export interface IRefreshTokenController {
  refreshToken(req: Request, res: Response): Promise<ResponseType<null>>;
}
