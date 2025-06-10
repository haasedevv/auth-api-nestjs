import { IsEmail, IsString } from 'class-validator';

export class ValidateGoogleUserPayloadDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
