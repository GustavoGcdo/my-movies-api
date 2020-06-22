import { inject, injectable } from 'inversify';
import { LoginContract } from '../../contracts/auth/login.contract';
import { LoginDto } from '../../dtos/auth/login.dto';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { Result } from '../../infra/result';
import { ILoginHandler } from '../../interfaces/auth/handlers/loginHandler.interface';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import { AuthenticationService } from '../../services/authentication.service';
import UserTypes from '../../types/user.types';
import { Report } from '../../infra/report';
import { EncryptService } from '../../services/encrypt.service';
import config from '../../config';

@injectable()
export class LoginHandler implements ILoginHandler {
  private _userRepository: IUserRepository;

  constructor(@inject(UserTypes.UserRepository) userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async handle(loginDto: LoginDto): Promise<Result> {
    this.validate(loginDto);
    const token = await this.getTokenUser(loginDto);
    const resultSucess = new Result({ token }, 'login successfully', true, []);
    return resultSucess;
  }

  private validate(loginDto: LoginDto) {
    this.validateContract(loginDto);
  }

  private validateContract(loginDto: LoginDto) {
    const contract = new LoginContract();
    const isNotValid = !contract.validate(loginDto);

    if (isNotValid) {
      throw new ValidationFailedError('login failed', ...contract.reports);
    }
  }

  private async getTokenUser(loginDto: LoginDto) {
    const encryptedPassword = EncryptService.encrypt(loginDto.password, config.SALT_KEY);

    const [foundUser] = await this._userRepository.find({
      email: loginDto.email,
      password: encryptedPassword,
    });

    if (foundUser == null) {
      const report: Report = { name: 'auth', message: 'user or password not match' };
      throw new ValidationFailedError('fail to login', report);
    }

    const dataToken = {
      _id: foundUser._id,
      username: foundUser.email,
      name: foundUser.profiles,
    };
    const token = AuthenticationService.generateToken(dataToken);
    return token;
  }
}
