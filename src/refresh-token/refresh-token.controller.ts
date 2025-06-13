import { JwtPayloadType } from '@/auth/types/strategy/jwt-payload.type';
import { ResponseType } from '@/common/types/response.type';
import { RefreshTokenGuard } from '@/refresh-token/guards/refresh-token.guard';
import { IRefreshTokenController } from '@/refresh-token/interfaces/refresh-token-controller.interface';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import {
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('refresh-token')
@Controller('refresh-token')
export class RefreshTokenController implements IRefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @UseGuards(RefreshTokenGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh token successfully refreshed.',
  })
  @Post()
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<null>> {
    const user = req.user as JwtPayloadType;

    const refreshTokenResult = await this.refreshTokenService.refreshToken({
      userId: user.userId,
      email: user.email,
      name: user.email,
    });

    if (!refreshTokenResult) throw new UnauthorizedException('Failed to refresh token');

    res.status(HttpStatus.OK);
    res.cookie('userInfos', refreshTokenResult, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Refresh token successfully refreshed',
      success: true,
      data: null,
    };
  }
}
