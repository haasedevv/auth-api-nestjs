import { UserProvider } from '@/common/enums/user-provider.enum';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

export class findUserByEmailAndExternalProviderPayloadDto {
  @Length(1, 120)
  @IsString()
  name: string;

  @Length(1, 120)
  @IsEmail()
  email: string;

  @IsEnum(UserProvider)
  provider: UserProvider;
}
