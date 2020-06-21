import { MyMovie } from '../../../models/entities/myMovie';

export interface IMyMoviesRepository {
  find(filter: any): Promise<MyMovie[]>;
  create(myMovie: MyMovie): Promise<MyMovie>;
  markAsWatched(idMovie: string): Promise<MyMovie>;
}
