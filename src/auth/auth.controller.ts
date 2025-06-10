import { AuthService } from '@/auth/auth.service';
import { SignInRequestDto } from '@/auth/dto/request/signin-request.dto';
import { GoogleAuthGuard } from '@/auth/guards/google-auth.guard';
import { IAuthController } from '@/auth/interfaces/auth-controller.interface';
import { HttpException } from '@/common/exceptions/custom/custom.exception';
import { InferIdType } from '@/common/types/object-with-id.type';
import { User } from '@/user/entities/user.entity';
import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements IAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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

  @UseGuards(GoogleAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Redirecting to Google login' })
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Redirecting to Google callback' })
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as InferIdType<User, string>;

    if (!user) {
      throw new HttpException(null, HttpStatus.BAD_REQUEST);
    }

    const jwtPayload = {
      sub: user?.id,
      email: user?.email,
      name: user?.name,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload);

    res.status(HttpStatus.OK);
    res.redirect(`${process.env.FRONTEND_URL}?accessToken=${accessToken}`);
  }
}
