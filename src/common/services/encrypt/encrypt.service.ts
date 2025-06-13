import * as crypto from 'crypto';

export class EncryptService {
  private readonly ALGORITHM = 'aes-256-cbc';
  private readonly key = Buffer.from(process.env.CRYPTO_KEY!, 'hex');
  private readonly iv = crypto.randomBytes(16);

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted + ':' + this.iv.toString('hex');
  }

  decrypt(encrypted: string): string {
    const [encryptedText, iv] = encrypted.split(':');

    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
