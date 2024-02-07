import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(response: any, status: HttpStatus) {
    super(response, status);
  }
}
