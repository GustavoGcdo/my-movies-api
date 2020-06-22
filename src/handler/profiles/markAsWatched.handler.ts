import { IMarkAsWatchedHandler } from '../../interfaces/profiles/handlers/markAsWatchedHandler.interface';
import { injectable, inject } from 'inversify';
import { MarkAsWatchedDto } from '../../dtos/profiles/markAsWatched.dto';
import { Result } from '../../infra/result';
import { IMyMoviesRepository } from '../../interfaces/myMovies/repositories/myMoviesRepository.interface';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import ProfileTypes from '../../types/profile.types';
import UserTypes from '../../types/user.types';
import { MarkAsWatchedContract } from '../../contracts/profiles/markAsWatched.contract';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { Report } from '../../infra/report';

@injectable()
export class MarkAsWatchedHandler implements IMarkAsWatchedHandler {
  private _userRepository: IUserRepository;
  private _myMovieRepository: IMyMoviesRepository;

  constructor(
    @inject(UserTypes.UserRepository) userRepository: IUserRepository,
    @inject(ProfileTypes.MyMoviesRepository) myMovieRepository: IMyMoviesRepository,
  ) {
    this._userRepository = userRepository;
    this._myMovieRepository = myMovieRepository;
  }

  async handle(markAsWatchedDto: MarkAsWatchedDto): Promise<Result> {
    await this.validate(markAsWatchedDto);
    await this.markMovieAsWatched(markAsWatchedDto);

    const resultSucess = new Result(null, 'movie marked as watched successfully', true, []);
    return resultSucess;
  }

  private async validate(markAsWatchedDto: MarkAsWatchedDto) {
    this.validateContract(markAsWatchedDto);
    await this.validateUseCases(markAsWatchedDto);
  }

  private validateContract(markAsWatchedDto: MarkAsWatchedDto) {
    const contract = new MarkAsWatchedContract();
    const isNotValid = !contract.validate(markAsWatchedDto);

    if (isNotValid) {
      throw new ValidationFailedError('could not mark as watched', ...contract.reports);
    }
  }

  private async validateUseCases(markAsWatchedDto: MarkAsWatchedDto) {
    const filerProfile = { 'profiles._id': markAsWatchedDto.profileId };
    const [foundUser] = await this._userRepository.find(filerProfile);
    if (foundUser == null) {
      const report: Report = { name: 'profile', message: 'profile not found' };
      throw new ValidationFailedError('could not mark as watched', report);
    }

    const filterMovie = { _id: markAsWatchedDto.movieId };
    const [foundMyMovie] = await this._myMovieRepository.find(filterMovie);
    if (foundMyMovie == null) {
      const report: Report = { name: 'movie', message: 'movie not found' };
      throw new ValidationFailedError('could not mark as watched', report);
    }
  }

  private async markMovieAsWatched(markAsWatchedDto: MarkAsWatchedDto) {
    await this._myMovieRepository.markAsWatched(
      markAsWatchedDto.profileId,
      markAsWatchedDto.movieId,
    );
  }
}
