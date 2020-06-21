import UserModel from '../models/schemas/user.schema';
import { injectable } from 'inversify';
import { User } from '../models/entities/user';
import { IUserRepository } from '../interfaces/repositories/userRepository.interface';
import { Profile } from '../models/entities/profile';

@injectable()
export class UserRepository implements IUserRepository {
  public async find(filter = {}): Promise<User[]> {
    const documents = await UserModel.find(filter);
    const mapedUsers = documents.map((o) => o.toObject());
    return mapedUsers;
  }

  public async create(user: User): Promise<User> {
    const documentCreated = await UserModel.create(user);
    const userCreated = documentCreated.toObject();
    return userCreated;
  }

  public async addProfile(idUser: string, profile: Profile): Promise<User> {
    const userUpdated = UserModel.updateOne({ _id: idUser }, { $push: { profiles: profile } });
    return userUpdated;
  }

  public async getProfiles(idUser: string): Promise<Profile[]> {
    const userFound: User = await UserModel.findOne({ _id: idUser })
      .select('profiles')
      .then((o) => o?.toObject());

    const profiles = userFound.profiles;
    return profiles;
  }
}
