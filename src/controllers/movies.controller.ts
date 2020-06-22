import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { GetRecommendedMoviesDto } from '../dtos/movies/getRecommendedMovies.dto';
import { SearchMovieDto } from '../dtos/movies/searchMovie.dto';
import { HttpStatus } from '../infra/enums/http-status.enum';
import { HandleResponse } from '../infra/handleResponse';
import { IGetRecommendedMoviesHandler } from '../interfaces/movies/handlers/getRecommendedMoviesHandler.interface';
import { ISearchMovieHandler } from '../interfaces/movies/handlers/searchMovieHandler.interface';
import MovieTypes from '../types/movie.types';

@injectable()
export class MoviesController {
  private _searchHandler: ISearchMovieHandler;
  private _getRecommendedMoviesHandler: IGetRecommendedMoviesHandler;

  constructor(
    @inject(MovieTypes.SearchMovieHandler) searchHandler: ISearchMovieHandler,
    @inject(MovieTypes.GetRecommendedMoviesHandler)
    getRecommendedMoviesHandler: IGetRecommendedMoviesHandler,
  ) {
    this._searchHandler = searchHandler;
    this._getRecommendedMoviesHandler = getRecommendedMoviesHandler;
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

  public async getRecommendedMovies(request: Request, response: Response) {
    try {
      const getRecommendedMoviesDto = {
        profileId: request.params.profile,
      } as GetRecommendedMoviesDto;
      const result = await this._getRecommendedMoviesHandler.handle(getRecommendedMoviesDto);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
