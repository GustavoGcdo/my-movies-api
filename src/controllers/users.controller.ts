import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { HandleResponse } from '../infra/handleResponse';
import { ISignupHandler } from '../interfaces/handlers/signupHandler.interface';
import Types from '../types/user.types';
import { AddProfileDto } from '../dtos/user/addProfile.dto';
import { IAddProfileHandler } from '../interfaces/handlers/addProfileHandler.interface';
import { GetProfilesDto } from '../dtos/user/getProfiles.dto';
import { IGetProfilesHandler } from '../interfaces/handlers/getProfilesHandler.interface';

@injectable()
export class UsersController {
  private _signupHandler: ISignupHandler;
  private _addProfileHandler: IAddProfileHandler;
  private _getProfileHandler: IGetProfilesHandler;

  constructor(
    @inject(Types.SignupHandler) signupHandler: ISignupHandler,
    @inject(Types.AddProfileHandler) addProfileHandler: IAddProfileHandler,
    @inject(Types.GetProfilesHandler) getProfilesHandler: IGetProfilesHandler,
  ) {
    this._signupHandler = signupHandler;
    this._addProfileHandler = addProfileHandler;
    this._getProfileHandler = getProfilesHandler;
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

  public async getProfiles(request: Request, response: Response) {
    try {
      const addProfileDto: GetProfilesDto = {
        idUser: request.params.id,
      };

      const result = await this._getProfileHandler.handle(addProfileDto);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
