import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class isValidID implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    const id = req.params.id;
    if (id && !Types.ObjectId.isValid(id)) {
      console.log('bad id from MW: ', id);
      throw new HttpException(`ID ${id} not found`, HttpStatus.BAD_REQUEST);
    }

    next();
  }
}
