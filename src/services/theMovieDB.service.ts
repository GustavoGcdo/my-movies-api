import { injectable } from 'inversify';
import TheMovieDBBase from './base/theMovieDBBase';
import { stringify } from 'querystring';
import config from '../config';

@injectable()
export class TheMovieDBService {
  async searchMovie(query: string) {
    const queryParam = stringify({ query, language: config.LANGUAGE });

    const response = await TheMovieDBBase.get(`/search/movie?${queryParam}`);
    return response.data;
  }
  
  async getPopularMovies() {
    const queryParam = stringify({ language: config.LANGUAGE });
    const response = await TheMovieDBBase.get(`/movie/popular?${queryParam}`);
    return response.data;
  }

  async getMoviesByGenres(genres: string) {
    const queryParam = stringify({ language: config.LANGUAGE, with_genres: genres });

    const response = await TheMovieDBBase.get(`discover/movie?${queryParam}`);
    return response.data;
  }
}
