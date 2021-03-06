import { inject, injectable } from 'inversify';
import { SignUpContract } from '../../contracts/user/signUp.contract';
import { SignUpDto } from '../../dtos/user/signUp.dto';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { Report } from '../../infra/report';
import { Result } from '../../infra/result';
import { ISignupHandler } from '../../interfaces/users/handlers/signupHandler.interface';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import { User } from '../../models/entities/user';
import UserTypes from '../../types/user.types';
import { EncryptService } from '../../services/encrypt.service';
import config from '../../config';

@injectable()
export class SignUpHandler implements ISignupHandler {
  private _repository: IUserRepository;

  constructor(@inject(UserTypes.UserRepository) repository: IUserRepository) {
    this._repository = repository;
  }

  public async handle(signUpDto: SignUpDto): Promise<Result> {
    await this.validate(signUpDto);
    const userCreated = await this.createNewUser(signUpDto);
    const resultSucess = new Result(userCreated, 'Sign up success', true, []);
    return resultSucess;
  }

  private async validate(signUpDto: SignUpDto) {
    this.validateContract(signUpDto);
    await this.validateUseCases(signUpDto);
  }

  private validateContract(signUpDto: SignUpDto) {
    const contract = new SignUpContract();
    const isNotValid = !contract.validate(signUpDto);

    if (isNotValid) {
      throw new ValidationFailedError('fail to register user', ...contract.reports);
    }
  }

  private async validateUseCases(signUpDto: SignUpDto) {
    const [alreadyRegisteredUser] = await this._repository.find({ email: signUpDto.email });
    if (alreadyRegisteredUser != null) {
      const report: Report = { name: 'email', message: 'email already registered' };
      throw new ValidationFailedError('fail to register user', report);
    }
  }

  private async createNewUser(signUpDto: SignUpDto) {
    const { email, password, name, birthday } = signUpDto;

    const encryptedPassword = EncryptService.encrypt(password, config.SALT_KEY);
    const newUser = {
      email,
      password: encryptedPassword,
      birthday,
      profiles: [{ name, isMain: true }],
    } as User;

    const userCreated = await this._repository.create(newUser);
    
    const returnObjet = {
      _id: userCreated._id,
      email: userCreated.email,
      profiles: userCreated.profiles,
    };
    return returnObjet;
  }
}
