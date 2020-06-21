import { inject, injectable } from 'inversify';
import { GetProfilesDto } from '../../dtos/user/getProfiles.dto';
import { Result } from '../../infra/result';
import { IGetProfilesHandler } from '../../interfaces/users/handlers/getProfilesHandler.interface';
import { IUserRepository } from '../../interfaces/users/repositories/userRepository.interface';
import UserTypes from '../../types/user.types';
import { GetProfilesContract } from '../../contracts/user/getProfiles.contract';
import { ValidationFailedError } from '../../infra/errors/validationFailedError';

@injectable()
export class GetProfilesHandler implements IGetProfilesHandler {
  private _repository: IUserRepository;

  constructor(@inject(UserTypes.UserRepository) repository: IUserRepository) {
    this._repository = repository;
  }

  async handle(getProfilesDto: GetProfilesDto): Promise<Result> {
    await this.validate(getProfilesDto);
    const profilesUser = await this.findProfiles(getProfilesDto);
    const resultSuccess = new Result(profilesUser, 'profiles successfully listed', true, []);
    return resultSuccess;
  }

  private async validate(getProfilesDto: GetProfilesDto) {
    this.validateContract(getProfilesDto);
  }

  private validateContract(getProfilesDto: GetProfilesDto) {
    const contract = new GetProfilesContract();
    const isNotValid = !contract.validate(getProfilesDto);
    
    if (isNotValid) {
      throw new ValidationFailedError('could not bring up profile list', ...contract.reports);
    }
  }

  private async findProfiles(getProfilesDto: GetProfilesDto) {
      const profilesUser = await this._repository.getProfiles(getProfilesDto.idUser);
      return profilesUser;
  }
}
