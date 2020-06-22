import { inject, injectable } from 'inversify';
import { AddToWatchListContract } from '../../contracts/profiles/addToWatchlist.contract';
import { AddToWatchlistDto } from '../../dtos/profiles/addToWatchlist.dto';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { Report } from '../../infra/report';
import { Result } from '../../infra/result';
import { IMyMoviesRepository } from '../../interfaces/myMovies/repositories/myMoviesRepository.interface';
import { IAddToWatchlistHandler } from '../../interfaces/profiles/handlers/addToWatchlistHandler.interface';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import { MyMovie } from '../../models/entities/myMovie';
import { TheMovieDBService } from '../../services/theMovieDB.service';
import ProfileTypes from '../../types/profile.types';
import UserTypes from '../../types/user.types';
import { User } from '../../models/entities/user';
import { MovieInfo } from '../../models/entities/movieInfo';
import { Genre } from '../../models/entities/genre';

@injectable()
export class AddToWatchlistHandler implements IAddToWatchlistHandler {
  private _service: TheMovieDBService;
  private _userRepository: IUserRepository;
  private _myMovieRepository: IMyMoviesRepository;
  private foundUserWithProfile: User | null = null;
  private moveToAdd: any;

  constructor(
    @inject(TheMovieDBService) service: TheMovieDBService,
    @inject(UserTypes.UserRepository) userRepository: IUserRepository,
    @inject(ProfileTypes.MyMoviesRepository) myMovieRepository: IMyMoviesRepository,
  ) {
    this._service = service;
    this._userRepository = userRepository;
    this._myMovieRepository = myMovieRepository;
  }

  async handle(addToWatchlistDto: AddToWatchlistDto): Promise<Result> {
    await this.validate(addToWatchlistDto);
    await this.addMovieToWatchlist(addToWatchlistDto);

    const resultSucess = new Result(null, 'movie successfully added to watchlist', true, []);
    return resultSucess;
  }

  private async validate(addToWatchlistDto: AddToWatchlistDto) {
    this.validateContract(addToWatchlistDto);
    await this.validateUseCases(addToWatchlistDto);
  }

  private validateContract(addToWatchlistDto: AddToWatchlistDto) {
    const contract = new AddToWatchListContract();
    const isNotValid = !contract.validate(addToWatchlistDto);

    if (isNotValid) {
      throw new ValidationFailedError('fail to add movie in watchlist', ...contract.reports);
    }
  }

  private async validateUseCases(addToWatchlistDto: AddToWatchlistDto) {
    const [foundUser] = await this._userRepository.find({
      'profiles._id': addToWatchlistDto.profileId,
    });
    if (foundUser == null) {
      const report: Report = { name: 'profile', message: 'profile not found' };
      throw new ValidationFailedError('fail to add movie in watchlist', report);
    }

    const foundMovie = await this._service.getSpecificMovie(addToWatchlistDto.movieId);
    if (foundMovie == null) {
      const report: Report = { name: 'movie', message: 'movie not found' };
      throw new ValidationFailedError('fail to add movie in watchlist', report);
    }

    this.foundUserWithProfile = foundUser;
    this.moveToAdd = foundMovie;
  }

  private async addMovieToWatchlist(addToWatchlistDto: AddToWatchlistDto) {
    const movie: MovieInfo = await this._service.getSpecificMovie(addToWatchlistDto.movieId);

    const profileToAdd = this.getProfileToAdd(addToWatchlistDto);
    const myMovieToAdd = { watched: false, info: movie, profile: profileToAdd } as MyMovie;
    await this._myMovieRepository.create(myMovieToAdd);

    const genreIds = this.getOnlyGenreId(movie.genres);
    await this._userRepository.addFavoriteGenre(addToWatchlistDto.profileId, genreIds);
    
  }

  private getProfileToAdd(addToWatchlistDto: AddToWatchlistDto) {
    const foundProfile = this.foundUserWithProfile?.profiles.find(
      (profile) => (profile._id = addToWatchlistDto.profileId),
    );
    return foundProfile;
  }

  private getOnlyGenreId(genres: Genre[]){
    return genres.map(g => g.id);
  }
}
