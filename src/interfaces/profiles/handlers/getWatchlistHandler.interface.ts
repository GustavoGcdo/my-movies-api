import { GetWatchlistDto } from '../../../dtos/profiles/getWatchlist.dto';
import { Result } from '../../../infra/result';

export interface IGetWatchlistHandler {
  handle(getWatchlistDto: GetWatchlistDto): Promise<Result>;
}
