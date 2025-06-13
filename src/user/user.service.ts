import { UserProvider } from '@/common/enums/user-provider.enum';
import { PasswordService } from '@/common/services/password/password.service';
import { InferIdType } from '@/common/types/object-with-id.type';
import { DtoUtil } from '@/common/utils/dto.util';
import { AddProviderToUserPayloadDto } from '@/user/dto/service/payload/add-provider-to-user-payload.dto';
import { CreateUserPayloadDto } from '@/user/dto/service/payload/create-user-payload.dto';
import { findUserByEmailAndExternalProviderPayloadDto } from '@/user/dto/service/payload/find-user-by-email-and-external-provider-payload.dto';
import { User } from '@/user/entities/user.entity';
import { IUserService } from '@/user/interfaces/user-service.interface';
import { UserRepository } from '@/user/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(payload: CreateUserPayloadDto): Promise<InferIdType<User, string>> {
    await DtoUtil.validateDto(CreateUserPayloadDto, payload);

    const user = await this.userRepository.findByEmail(payload.email);

    if (user && user.providers.includes(payload.provider)) {
      throw new BadRequestException('User with this email already exists');
    }

    const isLocalProvider = payload.provider === UserProvider.LOCAL;

    if (user && isLocalProvider && !user.providers.includes(UserProvider.LOCAL)) {
      return await this.addProviderToUser({
        user: user,
        provider: payload.provider,
        password: payload.password,
      });
    }

    let hashedPassword = '';
    const hasHashPassword = isLocalProvider && !payload.skipPasswordHashing;

    if (hasHashPassword && payload.password) {
      hashedPassword = await PasswordService.hashPassword(payload.password);
    }

    const createResult = await this.userRepository.create(
      {
        name: payload.name,
        email: payload.email,
        providers: [payload.provider],
        password: hasHashPassword ? hashedPassword : null,
      },
      ['email', 'name', 'providers', 'createdAt'],
    );

    if (!createResult) throw new BadRequestException('User creation failed');

    return createResult;
  }

  async findUserByEmailAndExternalProvider(
    payload: findUserByEmailAndExternalProviderPayloadDto,
  ): Promise<InferIdType<User, string>> {
    await DtoUtil.validateDto(findUserByEmailAndExternalProviderPayloadDto, payload);

    let user: InferIdType<User, string> | null = null;
    user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      user = await this.createUser({
        name: payload.name,
        email: payload.email,
        provider: payload.provider,
        skipPasswordHashing: true,
      });
    }

    if (user && !user.providers.includes(payload.provider)) {
      user = await this.addProviderToUser({
        user,
        provider: payload.provider,
      });
    }

    if (!user) throw new BadRequestException('User creation failed');

    return user;
  }

  async addProviderToUser(
    payload: AddProviderToUserPayloadDto,
  ): Promise<InferIdType<User, string>> {
    await DtoUtil.validateDto(AddProviderToUserPayloadDto, payload);

    const user = payload.userId ? await this.userRepository.findById(payload.userId) : payload.user;

    if (!user) throw new BadRequestException('User not found');

    if (user.providers.includes(payload.provider)) return user;

    const updateUserPayload: Partial<User> = {
      ...user,
      providers: [...user.providers, payload.provider],
    };

    if (payload.provider === UserProvider.LOCAL && payload.password) {
      updateUserPayload.password = await PasswordService.hashPassword(payload.password);
    }

    const updatedUserResult = await this.userRepository.updateById(user.id, updateUserPayload, [
      'email',
      'name',
      'providers',
      'createdAt',
    ]);

    if (!updatedUserResult) {
      throw new BadRequestException('Failed to update user with new provider');
    }

    return updatedUserResult;
  }
}
