import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class SignInPayloadDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '!123Ab' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/, {
    message:
      'password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
