import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { AddToWatchlistDto } from '../dtos/profiles/addToWatchlist.dto';
import { GetWatchlistDto } from '../dtos/profiles/getWatchlist.dto';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { HandleResponse } from '../infra/handleResponse';
import { IAddToWatchlistHandler } from '../interfaces/profiles/handlers/addToWatchlistHandler.interface';
import { IGetWatchlistHandler } from '../interfaces/profiles/handlers/getWatchlistHandler.interface';
import ProfileTypes from '../types/profile.types';

@injectable()
export class ProfilesController {
  private _addToWatchlistHandler: IAddToWatchlistHandler;
  private _getWatchlistHandler: IGetWatchlistHandler;

  constructor(
    @inject(ProfileTypes.AddToWatchlistHandler) addToWatchlistHandler: IAddToWatchlistHandler,
    @inject(ProfileTypes.GetWatchlistHandler) getWatchlistHandler: IGetWatchlistHandler,
  ) {
    this._addToWatchlistHandler = addToWatchlistHandler;
    this._getWatchlistHandler = getWatchlistHandler;
  }

  public async addToWatchlist(request: Request, response: Response) {
    try {
      const { movieId } = request.body;
      const { id } = request.params;
      const addToWatchlistDto = { movieId, profileId: id } as AddToWatchlistDto;

      const result = await this._addToWatchlistHandler.handle(addToWatchlistDto);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }

  public async getWatchlist(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const getWatchlistDto = { profileId: id } as GetWatchlistDto;

      const result = await this._getWatchlistHandler.handle(getWatchlistDto);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
