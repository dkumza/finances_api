// https://docs.nestjs.com/middleware

import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class validateID implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    if (id && !Types.ObjectId.isValid(id)) {
      console.log('bad id from MW: ', id);
      throw new HttpException(`ID not found`, HttpStatus.BAD_REQUEST);
    }

    next();
  }
}
