import { NextFunction, Request, Response } from 'express';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpStatus } from '../enums/http-status.enum';


export class Auth {

  public static async authorize(request: Request, response: Response, next: NextFunction) {
    console.log('Authentication Function');

    const token = request.body.token || request.query.token || request.headers['authorization'];

    if (!token) {
      return response.status(HttpStatus.UNAUTHORIZED).send({
        message: 'restricted access',
      });
    } else {
      
      return await AuthenticationService.verifyToken(token)
        .then(() => next())
        .catch(() => {
          return response.status(HttpStatus.UNAUTHORIZED).send({
            message: 'invalid token',
          });
        });
    }
  }
}
