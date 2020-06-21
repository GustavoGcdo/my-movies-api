import { injectable } from 'inversify';
import TheMovieDBBase from './base/theMovieDBBase';
import { stringify } from 'querystring';

@injectable()
export class TheMovieDBService {
  async searchMovie(query: string) {
    const queryParam = stringify({ query, language: process.env.LANGUAGE });

    const response = await TheMovieDBBase.get(`/search/movie?${queryParam}`);
    return response.data;
  }
}
