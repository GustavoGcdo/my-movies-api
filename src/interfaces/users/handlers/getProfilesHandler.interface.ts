import { GetProfilesDto } from '../../../dtos/user/getProfiles.dto';
import { Result } from '../../../infra/result';

export interface IGetProfilesHandler {
  handle(getProfilesDto: GetProfilesDto): Promise<Result>;
}
