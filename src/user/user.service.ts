import { PasswordService } from '@/common/services/password/password.service';
import { DtoUtil } from '@/common/utils/dto.util';
import { CreateUserRequestDto } from '@/user/dto/request/create-user-request.dto';
import { CreateUserPayloadDto } from '@/user/dto/service/payload/create-user-payload.dto';
import { IUserService } from '@/user/interfaces/user-service.interface';
import { CreateUserReturnType } from '@/user/types/services/return/create-user-return.type';
import { UserRepository } from '@/user/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(payload: CreateUserPayloadDto): Promise<CreateUserReturnType> {
    await DtoUtil.validateDto(CreateUserRequestDto, payload);

    const hashedPassword = await PasswordService.hashPassword(payload.password);

    const createResult = await this.userRepository.create(
      { ...payload, password: hashedPassword },
      ['email', 'name'],
    );

    if (!createResult) throw new BadRequestException('User creation failed');

    return {
      id: createResult.id,
      name: createResult.name,
      email: createResult.email,
    };
  }
}
