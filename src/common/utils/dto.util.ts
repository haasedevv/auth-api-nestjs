import { BadRequestException, ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class DtoUtil {
  static async validateDto(dtoClass: any, data: any) {
    const dtoInstance = plainToInstance(dtoClass, data);
    const errors = await validate(dtoInstance);

    if (!errors.length) return;

    const messages = this.transformDtoValidationErrorsToMessages(errors);
    throw new BadRequestException(messages);
  }

  static transformDtoValidationErrorsToMessages(errors: ValidationError[]): string[] {
    const messages: string[] = [];

    for (const error of errors) {
      if (error.constraints) {
        messages.push(...Object.values(error.constraints));
      } else if (error.children && error.children.length > 0) {
        messages.push(...this.transformDtoValidationErrorsToMessages(error.children));
      }
    }

    return messages;
  }
}
