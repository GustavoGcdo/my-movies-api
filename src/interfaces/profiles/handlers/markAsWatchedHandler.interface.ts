import { MarkAsWatchedDto } from '../../../dtos/profiles/markAsWatched.dto';
import { Result } from '../../../infra/result';

export interface IMarkAsWatchedHandler {
    handle(markAsWatchedDto: MarkAsWatchedDto): Promise<Result>;
  }
  