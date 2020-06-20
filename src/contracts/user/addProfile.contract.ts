import { AddProfileDto } from '../../dtos/user/addProfile.dto';
import { Validator } from '../../helpers/validator';
import { Report } from '../../infra/report';

export class AddProfileContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(addProfileDto: AddProfileDto): boolean {
    const { idUser, name } = addProfileDto;

    this.validateName(name);
    this.validateIdUser(idUser);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateName(name: string) {
    this.validator.isRequired(name, 'name', 'name is required');
  }

  private validateIdUser(id: string) {
    this.validator.isValidObjectId(id, 'id', 'invalid id');
  }
}
