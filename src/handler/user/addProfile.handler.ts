import { inject, injectable } from 'inversify';
import { AddProfileContract } from '../../contracts/user/addProfile.contract';
import { AddProfileDto } from '../../dtos/user/addProfile.dto';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';
import { Report } from '../../infra/report';
import { Result } from '../../infra/result';
import { IAddProfileHandler } from '../../interfaces/users/handlers/addProfileHandler.interface';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import { Profile } from '../../models/entities/profile';
import Types from '../../types/user.types';

@injectable()
export class AddProfileHandler implements IAddProfileHandler {
  private _repository: IUserRepository;

  constructor(@inject(Types.SignupRepository) repository: IUserRepository) {
    this._repository = repository;
  }

  async handle(addProfileDto: AddProfileDto): Promise<Result> {
    await this.validate(addProfileDto);
    this.addProfileToUser(addProfileDto);
    const resultSucess = new Result(null, 'profile added with success', true, []);
    return resultSucess;
  }

  private async validate(addProfileDto: AddProfileDto) {
    this.validateContract(addProfileDto);
    await this.validateUseCases(addProfileDto);
  }

  private validateContract(addProfileDto: AddProfileDto) {
    const contract = new AddProfileContract();
    const isNotValid = !contract.validate(addProfileDto);
    
    if (isNotValid) {
      throw new ValidationFailedError('fail to add profile to user', ...contract.reports);
    }
  }

  private async validateUseCases(addProfileDto: AddProfileDto) {
    const [userRegistered] = await this._repository.find({ _id: addProfileDto.idUser });
    if (userRegistered == null) {
      const report: Report = { name: 'user', message: 'user is not registered' };
      throw new ValidationFailedError('fail to add profile to user', report);
    }

    const MAX_NUM_PROFILES = 4;
    if (userRegistered && userRegistered.profiles.length == MAX_NUM_PROFILES) {
      const report: Report = {
        name: 'profiles',
        message: 'max number profiles already registered',
      };
      throw new ValidationFailedError('fail to add profile to user', report);
    }
  }

  private async addProfileToUser(addProfileDto: AddProfileDto) {
    const newProfile: Profile = { name: addProfileDto.name, isMain: false };
    this._repository.addProfile(addProfileDto.idUser, newProfile);
  }
}
