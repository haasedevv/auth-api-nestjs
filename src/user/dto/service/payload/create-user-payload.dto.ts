import { UserProvider } from '@/common/enums/user-provider.enum';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateUserPayloadDto {
  @Length(1, 120)
  @IsString()
  name: string;

  @Length(1, 120)
  @IsEmail()
  email: string;

  @ValidateIf(
    (o: CreateUserPayloadDto) => !o.skipPasswordHashing && o.provider === UserProvider.LOCAL,
  )
  @Length(1, 120)
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/, {
    message:
      'password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;

  @IsEnum(UserProvider)
  provider: UserProvider;

  @IsOptional()
  @IsBoolean()
  skipPasswordHashing?: boolean;
}
