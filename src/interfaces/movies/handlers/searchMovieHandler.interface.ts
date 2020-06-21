import { Result } from '../../../infra/result';
import { SearchMovieDto } from '../../../dtos/movies/searchMovie.dto';


export interface ISearchMovieHandler {
  handle(searchMovieDto: SearchMovieDto): Promise<Result>;
}
