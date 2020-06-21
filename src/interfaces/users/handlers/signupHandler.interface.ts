import { SignUpDto } from '../../../dtos/user/signUp.dto';
import { Result } from '../../../infra/result';

export interface ISignupHandler {
  handle(signUpDto: SignUpDto): Promise<Result>;
}
