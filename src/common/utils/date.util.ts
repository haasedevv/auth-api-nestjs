import * as ms from 'ms';
export class DateUtil {
  static generateExpiresAtDate(expiresIn?: string | number): Date {
    if (!expiresIn) throw new Error('expiresIn is required');
    let msValue: number;

    try {
      msValue = ms(expiresIn as ms.StringValue);
    } catch {
      throw new Error(`Invalid expiresIn value: ${expiresIn}`);
    }

    return new Date(Date.now() + msValue);
  }
}
