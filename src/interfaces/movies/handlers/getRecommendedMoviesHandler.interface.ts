import { GetRecommendedMoviesDto } from '../../../dtos/movies/getRecommendedMovies.dto';
import { Result } from '../../../infra/result';

export interface IGetRecommendedMoviesHandler {
  handle(getRecommendedMoviesDto: GetRecommendedMoviesDto): Promise<Result>;
}
