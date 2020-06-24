import { SocialLoginDto } from '../../dtos/auth/socialLogin.dto';
import { Validator } from '../../helpers/validator';
import { Report } from '../../infra/report';

export class SocialLoginContract {
  reports: Report[];
  validator: Validator;

  constructor() {
    this.reports = [];
    this.validator = new Validator();
  }

  public validate(socialLoginDto: SocialLoginDto): boolean {
    const { email, name, socialLogin } = socialLoginDto;

    this.validateUser(email);
    this.validateName(name);
    this.validateSocialLogin(socialLogin);

    this.reports.push(...this.validator.reports);
    return this.reports.length == 0;
  }

  private validateUser(email: string) {
    this.validator.isRequired(email, 'email', 'email is required');
  }
  private validateName(name: string) {
    this.validator.isRequired(name, 'name', 'name is required');
  }
  private validateSocialLogin(socialLogin: { facebookId: number }) {
    this.validator.isValidNumber(
      socialLogin.facebookId,
      'facebookId',
      'facebookId must be a valid number',
    );
  }
}
