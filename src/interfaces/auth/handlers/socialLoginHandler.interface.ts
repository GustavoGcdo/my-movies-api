import { SocialLoginDto } from '../../../dtos/auth/socialLogin.dto';
import { Result } from '../../../infra/result';

export interface ISocialLoginHandler {
  handle(loginDto: SocialLoginDto): Promise<Result>;
}
