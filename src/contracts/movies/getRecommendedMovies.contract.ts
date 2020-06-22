import { GetRecommendedMoviesDto } from '../../dtos/movies/getRecommendedMovies.dto';
import { Validator } from '../../helpers/validator';
import { Report } from '../../infra/report';

export class GetRecommendedMoviesContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(getRecommendedMoviesDto: GetRecommendedMoviesDto): boolean {
    const { profileId } = getRecommendedMoviesDto;

    this.validateProfileId(profileId);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateProfileId(id: string) {
    this.validator.isValidObjectId(id, 'id', 'invalid profile id');
  }
}
