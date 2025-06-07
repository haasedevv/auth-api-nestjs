import { compare, hash } from 'bcrypt';

export class PasswordService {
  static readonly saltOrRounds = 10;

  static async hashPassword(password: string): Promise<string> {
    return await hash(password, this.saltOrRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
