import { AddProfileDto } from '../../../dtos/user/addProfile.dto';
import { Result } from '../../../infra/result';

export interface IAddProfileHandler {
  handle(addProfileDto: AddProfileDto): Promise<Result>;
}
