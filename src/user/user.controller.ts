import { UserProvider } from '@/common/enums/user-provider.enum';
import { CreateUserRequestDto } from '@/user/dto/request/create-user-request.dto';
import { IUserController } from '@/user/interfaces/user-controller.interface';
import { UserService } from '@/user/user.service';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  async create(@Body() body: CreateUserRequestDto, @Res({ passthrough: true }) res: Response) {
    const createUserResult = await this.userService.createUser({
      ...body,
      provider: UserProvider.LOCAL,
    });

    res.status(HttpStatus.OK);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      success: true,
      data: createUserResult,
    };
  }
}
