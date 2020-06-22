import { Report } from '../../infra/report';
import { Validator } from '../../helpers/validator';
import { LoginDto } from '../../dtos/auth/login.dto';

export class LoginContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(loginDto: LoginDto): boolean {
    const { email, password } = loginDto;

    this.validateUser(email);
    this.validatePassword(password);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateUser(email: string) {
    this.validator.isRequired(email, 'email', 'email is required');
  }

  private validatePassword(password: string) {
    this.validator.isRequired(password, 'password', 'password is required');
  }
}
