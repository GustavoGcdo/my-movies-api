import { Report } from '../../infra/report';
import { Validator } from '../../helpers/validator';
import { MarkAsWatchedDto } from '../../dtos/profiles/markAsWatched.dto';

export class MarkAsWatchedContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(markAsWatchedDto: MarkAsWatchedDto): boolean {
    const { profileId, movieId } = markAsWatchedDto;

    this.validateProfileId(profileId);
    this.validateMovieId(movieId);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateProfileId(id: string) {
    this.validator.isValidObjectId(id, 'id', 'invalid profile id');
  }

  private validateMovieId(id: string) {
    this.validator.isValidObjectId(id, 'id', 'invalid movie id');
  }
}
