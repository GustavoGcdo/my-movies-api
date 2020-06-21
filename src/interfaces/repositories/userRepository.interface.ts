import { User } from '../../models/entities/user';
import { Profile } from '../../models/entities/profile';

export interface IUserRepository {
  find(filter: any): Promise<User[]>;
  create(user: User): Promise<User>;
  addProfile(idUser: string, name: Profile): Promise<User>;
  getProfiles(idUser: string): Promise<Profile[]>;
}
