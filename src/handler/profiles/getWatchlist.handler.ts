import { inject, injectable } from 'inversify';
import { GetWatchlistContract } from '../../contracts/profiles/getWatchlist.contract';
import { AddToWatchlistDto } from '../../dtos/profiles/addToWatchlist.dto';
import { GetWatchlistDto } from '../../dtos/profiles/getWatchlist.dto';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { Result } from '../../infra/result';
import { IMyMoviesRepository } from '../../interfaces/myMovies/repositories/myMoviesRepository.interface';
import { IGetWatchlistHandler } from '../../interfaces/profiles/handlers/getWatchlistHandler.interface';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import ProfileTypes from '../../types/profile.types';
import UserTypes from '../../types/user.types';

@injectable()
export class GetWatchlistHandler implements IGetWatchlistHandler {
  private _userRepository: IUserRepository;
  private _myMovieRepository: IMyMoviesRepository;

  constructor(
    @inject(UserTypes.UserRepository) userRepository: IUserRepository,
    @inject(ProfileTypes.MyMoviesRepository) myMovieRepository: IMyMoviesRepository,
  ) {
    this._userRepository = userRepository;
    this._myMovieRepository = myMovieRepository;
  }

  async handle(getWatchlistDto: GetWatchlistDto): Promise<Result> {    
    this.validate(getWatchlistDto);
    const watchlist = await this.findWatchlist(getWatchlistDto);
    const resultSuccess = new Result(watchlist, 'watchlist successfully found', true, []);
    return resultSuccess;
  }

  private async validate(getWatchlistDto: GetWatchlistDto) {
    this.validateContract(getWatchlistDto);
  }

  private validateContract(getWatchlistDto: GetWatchlistDto) {
    const contract = new GetWatchlistContract();
    const isNotValid = !contract.validate(getWatchlistDto);

    if (isNotValid) {
      throw new ValidationFailedError('unable to bring watchlist', ...contract.reports);
    }
  }

  private async findWatchlist(getWatchlistDto: GetWatchlistDto) {
    const filter = { 'profile._id': getWatchlistDto.profileId };
    const watchlist = await this._myMovieRepository.find(filter);
    return watchlist;
  }
}
