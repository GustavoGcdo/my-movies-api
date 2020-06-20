import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { HandleResponse } from '../infra/handleResponse';
import { ISignupHandler } from '../interfaces/handlers/signupHandler.interface';
import Types from '../types/user.types';

@injectable()
export class UsersController {
  private _signupHandler: ISignupHandler;

  constructor(@inject(Types.SignupHandler) signupHandler: ISignupHandler) {
    this._signupHandler = signupHandler;
  }

  public async signUp(request: Request, response: Response) {
    try {
      const result = await this._signupHandler.handle(request.body);
      return HandleResponse.handle(response, HttpStatus.CREATED, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
