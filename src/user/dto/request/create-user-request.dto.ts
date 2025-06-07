import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'example@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '!123Ab' })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/, {
    message:
      'password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
