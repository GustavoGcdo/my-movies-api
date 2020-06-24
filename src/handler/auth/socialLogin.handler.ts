import { inject, injectable } from 'inversify';
import { SocialLoginContract } from '../../contracts/auth/socialLogin.contract';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { Result } from '../../infra/result';
import { ISocialLoginHandler } from '../../interfaces/auth/handlers/socialLoginHandler.interface';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import { User } from '../../models/entities/user';
import { AuthenticationService } from '../../services/authentication.service';
import UserTypes from '../../types/user.types';
import { SocialLoginDto } from './../../dtos/auth/socialLogin.dto';

@injectable()
export class SocialLoginHandler implements ISocialLoginHandler {
  private _userRepository: IUserRepository;

  constructor(@inject(UserTypes.UserRepository) userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async handle(socialLoginDto: SocialLoginDto): Promise<Result> {
    this.validate(socialLoginDto);
    const token = await this.getTokenUser(socialLoginDto);

    const resultSucess = new Result({ token }, 'login successfully', true, []);
    return resultSucess;
  }

  private validate(socialLoginDto: SocialLoginDto) {
    this.validateContract(socialLoginDto);
  }

  private validateContract(socialLoginDto: SocialLoginDto) {
    const contract = new SocialLoginContract();
    const isNotValid = !contract.validate(socialLoginDto);

    if (isNotValid) {
      throw new ValidationFailedError('login failed', ...contract.reports);
    }
  }

  private async getTokenUser(socialLoginDto: SocialLoginDto) {
    const { email, name, socialLogin } = socialLoginDto;

    let [foundUser] = await this._userRepository.find({
      email: email,
      'socialLogin.facebookId': socialLogin.facebookId,
    });

    if (foundUser == null) {
      const newUser = {
        email,
        profiles: [
          {
            name,
            isMain: true,
          },
        ],
        socialLogin: {
          facebookId: socialLogin.facebookId,
        },
      } as User;

      foundUser = await this._userRepository.create(newUser);
    }

    const dataToken = {
      _id: foundUser._id,
      email: foundUser.email,
      profiles: foundUser.profiles,
    };
    const token = AuthenticationService.generateToken(dataToken);
    return token;
  }
}
