import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { AddToWatchlistDto } from '../dtos/profiles/addToWatchlist.dto';
import { GetWatchlistDto } from '../dtos/profiles/getWatchlist.dto';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { HandleResponse } from '../infra/handleResponse';
import { IAddToWatchlistHandler } from '../interfaces/profiles/handlers/addToWatchlistHandler.interface';
import { IGetWatchlistHandler } from '../interfaces/profiles/handlers/getWatchlistHandler.interface';
import ProfileTypes from '../types/profile.types';
import { MarkAsWatchedDto } from '../dtos/profiles/markAsWatched.dto';
import { IMarkAsWatchedHandler } from '../interfaces/profiles/handlers/markAsWatchedHandler.interface';

@injectable()
export class ProfilesController {
  private _addToWatchlistHandler: IAddToWatchlistHandler;
  private _getWatchlistHandler: IGetWatchlistHandler;
  private _markAsWatchedHandler: IMarkAsWatchedHandler;

  constructor(
    @inject(ProfileTypes.AddToWatchlistHandler) addToWatchlistHandler: IAddToWatchlistHandler,
    @inject(ProfileTypes.GetWatchlistHandler) getWatchlistHandler: IGetWatchlistHandler,
    @inject(ProfileTypes.MarkAsWatchedHandler) markAsWatchedHandler: IMarkAsWatchedHandler,
  ) {
    this._addToWatchlistHandler = addToWatchlistHandler;
    this._getWatchlistHandler = getWatchlistHandler;
    this._markAsWatchedHandler = markAsWatchedHandler;
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

  public async markAsWatched(request: Request, response: Response) {
    try {
      const { id, movie } = request.params;
      const markAsWatchedDto = { profileId: id, movieId: movie } as MarkAsWatchedDto;

      const result = await this._markAsWatchedHandler.handle(markAsWatchedDto);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
