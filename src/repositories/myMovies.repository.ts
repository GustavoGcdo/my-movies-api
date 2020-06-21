import { IMyMoviesRepository } from '../interfaces/myMovies/repositories/myMoviesRepository.interface';
import { MyMovie } from '../models/entities/myMovie';
import MyMovieModel from '../models/schemas/myMovie.schema';
import { injectable } from 'inversify';

@injectable()
export class MyMoviesRepository implements IMyMoviesRepository {
  async find(filter: any): Promise<MyMovie[]> {
    const documents = await MyMovieModel.find(filter);
    const mapedMyMovies = documents.map((o) => o.toObject());
    return mapedMyMovies;
  }

  async create(myMovie: MyMovie): Promise<MyMovie> {
    const documentCreated = await MyMovieModel.create(myMovie);
    const myMovieCreated = documentCreated.toObject();
    return myMovieCreated;
  }

  async markAsWatched(idMovie: string): Promise<MyMovie> {
    const updatedMyMovie = await MyMovieModel.updateOne({ _id: idMovie }, { watched: true });
    return updatedMyMovie;
  }
}
