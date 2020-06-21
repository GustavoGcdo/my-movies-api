import { Genre } from './genre';
export interface MovieInfo {
  id: number;
  original_title: string;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  genres: Genre[];
}
