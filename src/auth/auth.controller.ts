import { AuthService } from '@/auth/auth.service';
import { SignInRequestDto } from '@/auth/dto/request/signin-request.dto';
import { GithubAuthGuard } from '@/auth/guards/github-auth.guard';
import { GoogleAuthGuard } from '@/auth/guards/google-auth.guard';
import { IAuthController } from '@/auth/interfaces/auth-controller.interface';
import { HttpException } from '@/common/exceptions/custom/custom.exception';
import { InferIdType } from '@/common/types/object-with-id.type';
import { ResponseType } from '@/common/types/response.type';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { User } from '@/user/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements IAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
  @Post('signin')
  async signin(
    @Body() body: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<null>> {
    const signInResult = await this.authService.signIn(body);

    res.cookie('userInfos', signInResult, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    res.status(HttpStatus.OK);

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      success: true,
      data: null,
    };
  }

  @UseGuards(GithubAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Redirecting to GitHub sign-in' })
  @Get('github/signin')
  githubSignIn() {}

  @UseGuards(GithubAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Redirecting to GitHub callback' })
  @Get('github/callback')
  async githubCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<null>> {
    const user = req.user as InferIdType<User, string>;

    if (!user) {
      throw new HttpException(null, HttpStatus.BAD_REQUEST);
    }

    const refreshTokenPayload = {
      userId: user?.id,
      email: user?.email,
      name: user?.name,
    };

    const createRefreshTokenResult =
      await this.refreshTokenService.createRefreshToken(refreshTokenPayload);

    if (!createRefreshTokenResult)
      throw new UnauthorizedException('Failed to generate refresh token');

    res.status(HttpStatus.OK);
    res.redirect(
      `${process.env.FRONTEND_URL}?refreshToken=${createRefreshTokenResult.refreshToken}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      success: true,
      data: null,
    };
  }

  @UseGuards(GoogleAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Redirecting to Google sign-in' })
  @Get('google/signin')
  googleSignIn() {}

  @UseGuards(GoogleAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Redirecting to Google callback' })
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<null>> {
    const user = req.user as InferIdType<User, string>;

    if (!user) {
      throw new HttpException(null, HttpStatus.BAD_REQUEST);
    }

    const refreshTokenPayload = {
      userId: user?.id,
      email: user?.email,
      name: user?.name,
    };

    const createRefreshTokenResult =
      await this.refreshTokenService.createRefreshToken(refreshTokenPayload);

    if (!createRefreshTokenResult)
      throw new UnauthorizedException('Failed to generate refresh token');

    res.status(HttpStatus.OK);
    res.redirect(
      `${process.env.FRONTEND_URL}?refreshToken=${createRefreshTokenResult.refreshToken}`,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      success: true,
      data: null,
    };
  }
}
