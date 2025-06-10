import { AuthService } from '@/auth/auth.service';
import { SignInRequestDto } from '@/auth/dto/request/signin-request.dto';
import { IAuthController } from '@/auth/interfaces/auth-controller.interface';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
  @Post('login')
  async signin(@Body() body: SignInRequestDto, @Res({ passthrough: true }) res: Response) {
    const signInResult = await this.authService.signIn(body);

    res.status(HttpStatus.OK);

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      success: true,
      data: signInResult,
    };
  }
}
