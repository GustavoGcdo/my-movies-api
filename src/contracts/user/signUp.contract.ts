import { SignUpDto } from '../../dtos/user/signUp.dto';
import { Validator } from '../../helpers/validator';
import { Report } from '../../infra/report';

export class SignUpContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(signUpDto: SignUpDto): boolean {
    const { email, password, confirmPassword, name } = signUpDto;

    this.validateEmail(email);
    this.validateName(name);
    this.validatePassword(password);
    this.validateConfirmPassword(password, confirmPassword);

    this.reports.push(...this.validator.reports);

    return this.reports.length == 0;
  }

  private validateName(name: string) {
    this.validator.isRequired(name, 'name', 'name is required');
  }

  private validateEmail(email: string) {
    this.validator.isRequired(email, 'email', 'email is required');
    this.validator.isValidEmail(email, 'email', 'invalid email');
  }

  private validatePassword(password: string) {
    this.validator.isRequired(password, 'password', 'password is required');

    if (password) {
      const MIN_PASSWORD_LENGTH = 6;
      this.validator.isLessThan(
        password.length,
        MIN_PASSWORD_LENGTH,
        'password',
        `password must be at least 6 characters`,
      );
    }
  }

  private validateConfirmPassword(password: string, confirmPassword: string) {
    this.validator.isRequired(confirmPassword, 'confirmPassword', 'confirmPassword is required');

    if (password != confirmPassword) {
      this.reports.push({
        name: 'confirmPassword',
        message: 'confirm password not match with password',
      });
    }
  }
}
