import { GetWatchlistDto } from '../../dtos/profiles/getWatchlist.dto';
import { Validator } from '../../helpers/validator';
import { Report } from '../../infra/report';

export class GetWatchlistContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(getWatchlistDto: GetWatchlistDto): boolean {
    const { profileId } = getWatchlistDto;

    this.validateProfileId(profileId);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateProfileId(id: string) {
    this.validator.isValidObjectId(id, 'id', 'invalid id');
  }
}
