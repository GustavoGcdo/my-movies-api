import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { HandleResponse } from '../infra/handleResponse';
import UserTypes from '../types/user.types';
import { ISearchMovieHandler } from '../interfaces/movies/handlers/searchMovieHandler.interface';
import { SearchMovieDto } from '../dtos/movies/searchMovie.dto';
import MovieTypes from '../types/movie.types';

@injectable()
export class MoviesController {
  private _searchHandler: ISearchMovieHandler;

  constructor(@inject(MovieTypes.SearchMovieHandler) searchHandler: ISearchMovieHandler) {
    this._searchHandler = searchHandler;
  }

  public async searchMovie(request: Request, response: Response) {
    try {
      const searchMovieDto = {
        search: request.query.search,
      } as SearchMovieDto;
      const result = await this._searchHandler.handle(searchMovieDto);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
