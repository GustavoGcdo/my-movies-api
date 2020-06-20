import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { HandleResponse } from '../infra/handleResponse';
import { ISignupHandler } from '../interfaces/handlers/signupHandler.interface';
import Types from '../types/user.types';
import { AddProfileDto } from '../dtos/user/addProfile.dto';
import { IAddProfileHandler } from '../interfaces/handlers/addProfileHandler.interface';

@injectable()
export class UsersController {
  private _signupHandler: ISignupHandler;
  private _addProfileHandler: IAddProfileHandler;

  constructor(
    @inject(Types.SignupHandler) signupHandler: ISignupHandler,
    @inject(Types.AddProfileHandler) addProfileHandler: IAddProfileHandler
    ) {
    this._signupHandler = signupHandler;
    this._addProfileHandler = addProfileHandler;
  }

  public async signUp(request: Request, response: Response) {
    try {
      const result = await this._signupHandler.handle(request.body);
      return HandleResponse.handle(response, HttpStatus.CREATED, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }

  public async addProfile(request: Request, response: Response) {
    try {
      const addProfileDto: AddProfileDto = {
        idUser: request.params.id,
        ...request.body,
      };
      
      const result = await this._addProfileHandler.handle(addProfileDto);      
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {      
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
