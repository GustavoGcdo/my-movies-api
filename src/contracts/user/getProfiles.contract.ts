import { GetProfilesDto } from '../../dtos/user/getProfiles.dto';
import { Validator } from '../../helpers/validator';
import { Report } from '../../infra/report';

export class GetProfilesContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(getProfilesDto: GetProfilesDto): boolean {
    const { idUser } = getProfilesDto;

    this.validateIdUser(idUser);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateIdUser(id: string) {
    this.validator.isValidObjectId(id, 'id', 'invalid id');
  }
}
