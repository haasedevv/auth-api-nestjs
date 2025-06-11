import { UserProvider } from '@/common/enums/user-provider.enum';
import { InferIdType } from '@/common/types/object-with-id.type';
import { User } from '@/user/entities/user.entity';
import { IsEnum, IsObject, IsString, Length, Matches, ValidateIf } from 'class-validator';

export class AddProviderToUserPayloadDto {
  @ValidateIf((o: AddProviderToUserPayloadDto) => !o.user)
  @IsString()
  userId?: string;

  @IsEnum(UserProvider)
  provider: UserProvider;

  @ValidateIf((o: AddProviderToUserPayloadDto) => o.provider === UserProvider.LOCAL)
  @Length(1, 120)
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/, {
    message:
      'password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;

  @ValidateIf((o: AddProviderToUserPayloadDto) => !o.userId)
  @IsObject()
  user?: InferIdType<User, string> | null = null;
}
