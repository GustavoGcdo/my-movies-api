import { SearchMovieDto } from '../../dtos/movies/searchMovie.dto';
import { Result } from '../../infra/result';
import { ISearchMovieHandler } from '../../interfaces/movies/handlers/searchMovieHandler.interface';
import { inject, injectable } from 'inversify';
import { TheMovieDBService } from '../../services/theMovieDB.service';
import { SearchMovieContract } from '../../contracts/movies/searchMovie.contract';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { SearchResultDto } from '../../dtos/movies/searchResult.dto';

@injectable()
export class SearchMovieHandler implements ISearchMovieHandler {
  private _service: TheMovieDBService;

  constructor(@inject(TheMovieDBService) service: TheMovieDBService) {
    this._service = service;
  }

  async handle(searchMovieDto: SearchMovieDto): Promise<Result> {
    this.validate(searchMovieDto);
    const moviesResult = await this.getMoviesResult(searchMovieDto);
    const resultSucess = new Result(moviesResult, 'movies found successfully', true, []);
    return resultSucess;
  }

  private validate(searchMovieDto: SearchMovieDto) {
    this.validateContract(searchMovieDto);
  }

  private validateContract(searchMovieDto: SearchMovieDto) {
    const contract = new SearchMovieContract();
    const isNotValid = !contract.validate(searchMovieDto);

    if (isNotValid) {
      throw new ValidationFailedError('failed to fetch movies', ...contract.reports);
    }
  }

  private async getMoviesResult(searchMovieDto: SearchMovieDto) {
    const searchResult = await this._service.searchMovie(searchMovieDto.search);
    this.treatSearchResult(searchResult);
    return searchResult;
  }

  private treatSearchResult(searchResult: SearchResultDto){
    searchResult.results = this.mapMovies(searchResult.results);
  }

  private mapMovies(results: any[]) {
    return results.map(movie => {
      return {
        id: movie.id,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        genre_ids: movie.genre_ids,
        original_title: movie.original_title,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      }
    })
  }
}
