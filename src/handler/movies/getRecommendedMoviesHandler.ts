import { injectable, inject } from 'inversify';
import { GetRecommendedMoviesDto } from '../../dtos/movies/getRecommendedMovies.dto';
import { Result } from '../../infra/result';
import { IGetRecommendedMoviesHandler } from '../../interfaces/movies/handlers/getRecommendedMoviesHandler.interface';
import { TheMovieDBService } from '../../services/theMovieDB.service';
import { GetRecommendedMoviesContract } from '../../contracts/movies/getRecommendedMovies.contract';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import UserTypes from '../../types/user.types';
import { User } from '../../models/entities/user';
import { Report } from '../../infra/report';

@injectable()
export class GetRecommendedMoviesHandler implements IGetRecommendedMoviesHandler {
  private _service: TheMovieDBService;
  private _userRepository: IUserRepository;

  constructor(
    @inject(TheMovieDBService) service: TheMovieDBService,
    @inject(UserTypes.UserRepository) userRepository: IUserRepository,
  ) {
    this._service = service;
    this._userRepository = userRepository;
  }

  async handle(getRecommendedMoviesDto: GetRecommendedMoviesDto): Promise<Result> {
    this.validate(getRecommendedMoviesDto);
    const recommendedMovies = await this.getRecommendedMoviesForProfile(getRecommendedMoviesDto);

    const resultSucess = new Result(
      recommendedMovies,
      'recommended movies found successfully',
      true,
      [],
    );
    return resultSucess;
  }

  private async validate(getRecommendedMoviesDto: GetRecommendedMoviesDto) {
    this.validateContract(getRecommendedMoviesDto);
  }

  private validateContract(getRecommendedMoviesDto: GetRecommendedMoviesDto) {
    const contract = new GetRecommendedMoviesContract();
    const isNotValid = !contract.validate(getRecommendedMoviesDto);

    if (isNotValid) {
      throw new ValidationFailedError('failed to fetch recommended movies', ...contract.reports);
    }
  }

  private async getRecommendedMoviesForProfile(getRecommendedMoviesDto: GetRecommendedMoviesDto) {
    const { profileId } = getRecommendedMoviesDto;
    const [foundUser] = await this._userRepository.find({ 'profiles._id': profileId });

    if (foundUser == null) {
      const report: Report = { name: 'profile', message: 'profile not found' };
      throw new ValidationFailedError('failed to fetch recommended movies', report);
    }

    const profile = this.getProfileSelected(profileId, foundUser);
    let recommendedMovies = [];
    
    if (profile?.favoriteGenres) {
      if (profile?.favoriteGenres && profile?.favoriteGenres?.length == 0) {
        const popularMovies = await this._service.getPopularMovies();
        recommendedMovies = popularMovies.results;
      } else {
        const queryGenres = this.mountQueryForFavoriteGenres(profile?.favoriteGenres);
        const moviesWithSameGenres = await this._service.getMoviesByGenres(queryGenres);
        recommendedMovies = moviesWithSameGenres.results;
      }
    }

    return this.mapMovies(recommendedMovies);
  }

  private getProfileSelected(profileId: string, user: User) {
    const profile = user.profiles.find((p) => (p._id == profileId));
    return profile;
  }

  private mountQueryForFavoriteGenres(genresId: number[]) {
    return genresId.map((a) => a.toString()).join('|');
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
