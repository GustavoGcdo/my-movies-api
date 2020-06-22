import { MovieInfo } from './movieInfo';
import { Profile } from './profile';

export interface MyMovie {
    _id: string;
    info: MovieInfo;
    watched: boolean;
    profile: Profile;
}