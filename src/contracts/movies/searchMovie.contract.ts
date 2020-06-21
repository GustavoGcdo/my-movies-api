import { Validator } from '../../helpers/validator';
import { Report } from '../../infra/report';
import { SearchMovieDto } from '../../dtos/movies/searchMovie.dto';

export class SearchMovieContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(searchMovieDto: SearchMovieDto): boolean {
    const { search } = searchMovieDto;

    this.validateQuery(search);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateQuery(search: string) {
    this.validator.isRequired(search, 'search', 'search is required');
  }
}
