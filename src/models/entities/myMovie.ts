import { MovieInfo } from './movieInfo';
import { Profile } from './profile';

export interface MyMovie {
    info: MovieInfo;
    watched: boolean;
    profile: Profile;
}