import { ExceptionResponseType } from '@common/exceptions/custom/types/exception-response.type';
import { HttpStatus, HttpException as NestHttpException } from '@nestjs/common';
import { getReasonPhrase } from 'http-status-codes';

export class HttpException extends NestHttpException {
  constructor(
    data: object | null = null,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    message: string = getReasonPhrase(HttpStatus.BAD_REQUEST),
  ) {
    const response: ExceptionResponseType = {
      message,
      data,
    };

    super(response, statusCode);
  }
}
