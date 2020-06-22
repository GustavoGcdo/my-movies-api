import { LoginDto } from '../../../dtos/auth/login.dto';
import { Result } from '../../../infra/result';

export interface ILoginHandler {
  handle(loginDto: LoginDto): Promise<Result>;
}
