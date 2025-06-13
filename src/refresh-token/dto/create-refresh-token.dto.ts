import { IsEmail, IsString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
