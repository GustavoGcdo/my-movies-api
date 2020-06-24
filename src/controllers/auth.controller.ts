import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { HandleResponse } from '../infra/handleResponse';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { Result } from '../infra/result';
import { ILoginHandler } from '../interfaces/auth/handlers/loginHandler.interface';
import AuthTypes from '../types/auth.types';
import { LoginDto } from '../dtos/auth/login.dto';
import { ISocialLoginHandler } from '../interfaces/auth/handlers/socialLoginHandler.interface';

@injectable()
export class AuthController {
  private _loginHandler: ILoginHandler;
  private _socialLoginHandler: ISocialLoginHandler;

  constructor(
    @inject(AuthTypes.LoginHandler) loginHandler: ILoginHandler,
    @inject(AuthTypes.SocialLoginHandler) socialLoginHandler: ISocialLoginHandler,
  ) {
    this._loginHandler = loginHandler;
    this._socialLoginHandler = socialLoginHandler;
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

  public async socialLogin(request: Request, response: Response) {
    try {
      const { body } = request;
      const result = await this._socialLoginHandler.handle(body);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
