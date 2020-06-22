import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { HandleResponse } from '../infra/handleResponse';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { Result } from '../infra/result';
import { ILoginHandler } from '../interfaces/auth/handlers/loginHandler.interface';
import AuthTypes from '../types/auth.types';
import { LoginDto } from '../dtos/auth/login.dto';

@injectable()
export class AuthController {
  private _loginHandler: ILoginHandler;

  constructor(@inject(AuthTypes.LoginHandler) loginHandler: ILoginHandler) {
    this._loginHandler = loginHandler;
  }

  public async login(request: Request, response: Response) {
    try {
      const { body } = request;
      const result = await this._loginHandler.handle(body);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
