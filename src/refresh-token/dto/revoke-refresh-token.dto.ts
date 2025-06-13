import { IsString } from 'class-validator';

export class RevokeRefreshTokenDto {
  @IsString()
  userId: string;
}
