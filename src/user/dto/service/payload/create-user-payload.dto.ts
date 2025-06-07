import { UserProvider } from '@/common/enums/user-provider.enum';
import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';

export class CreateUserPayloadDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/, {
    message:
      'password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @IsEnum(UserProvider)
  provider: UserProvider;
}
