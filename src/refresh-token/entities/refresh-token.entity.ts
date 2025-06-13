export class RefreshToken {
  constructor(
    public token: string,
    public userId: string,
    public expiresAt: Date,
    public revoked: boolean = false,
    public createdAt: Date | null = new Date(),
    public updatedAt: Date | null = new Date(),
  ) {}
}
