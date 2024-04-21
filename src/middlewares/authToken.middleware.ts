import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('AuthToken in progress');
    const prepForToken = req.headers.authorization;
    console.log('prepForToken: ', prepForToken);

    if (!prepForToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const token = prepForToken.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Unauthorized token');
      }

      const decoded = jwt.verify(token, jwtSecret);
      //   req.userID = decoded.sub;
      console.log('decoded: ', decoded);
      next();
    } catch (error) {
      console.log('error: ', error);
      throw new UnauthorizedException('Auth error');
    }
  }
}
