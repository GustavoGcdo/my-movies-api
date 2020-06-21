import { AddToWatchlistDto } from '../../../dtos/profiles/addToWatchlist.dto';
import { Result } from '../../../infra/result';

export interface IAddToWatchlistHandler {
  handle(addToWatchlistDto: AddToWatchlistDto): Promise<Result>;
}
