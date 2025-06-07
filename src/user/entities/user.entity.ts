import { UserProvider } from '@/common/enums/user-provider.enum';

export class User {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public provider: UserProvider,
    public createdAt: Date | null = new Date(),
    public updatedAt: Date | null,
  ) {}
}
