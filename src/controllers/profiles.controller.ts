import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { SearchMovieDto } from '../dtos/movies/searchMovie.dto';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { HandleResponse } from '../infra/handleResponse';
import { IAddToWatchlistHandler } from '../interfaces/profiles/handlers/addToWatchlistHandler.interface';
import MovieTypes from '../types/movie.types';
import { AddToWatchlistDto } from '../dtos/profiles/addToWatchlist.dto';
import ProfileTypes from '../types/profile.types';

@injectable()
export class ProfilesController {
  private _addToWatchlistHandler: IAddToWatchlistHandler;

  constructor(
    @inject(ProfileTypes.AddToWatchlistHandler) addToWatchlistHandler: IAddToWatchlistHandler,
  ) {
    this._addToWatchlistHandler = addToWatchlistHandler;
  }

  public async addToWatchlist(request: Request, response: Response) {
    try {
      const { movieId } = request.body;
      const { id } = request.params;
      const addToWatchlistDto = { movieId, profileId: id } as AddToWatchlistDto;

      const result = await this._addToWatchlistHandler.handle(addToWatchlistDto);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      // console.log(error);
      
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
