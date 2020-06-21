import { AddToWatchlistDto } from '../../dtos/profiles/addToWatchlist.dto';
import { Validator } from '../../helpers/validator';
import { Report } from '../../infra/report';

export class addToWatchListContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(addToWatchlistDto: AddToWatchlistDto): boolean {
    const { movieId, profileId } = addToWatchlistDto;

    this.validateMovieId(movieId);
    this.validateProfileId(profileId);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateMovieId(movieId: number) {
    this.validator.isValidNumber(movieId, 'movieId', 'movieId must be a valid number');
  }

  private validateProfileId(id: string) {    
    this.validator.isValidObjectId(id, 'id', 'invalid profile id');
  }
}
