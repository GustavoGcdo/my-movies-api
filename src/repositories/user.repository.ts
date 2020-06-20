import UserModel from '../models/schemas/user.schema';
import { injectable } from 'inversify';
import { User } from '../models/entities/user';
import { IUserRepository } from '../interfaces/repositories/userRepository.interface';

@injectable()
export class UserRepository implements IUserRepository {
  public async find(filter = {}): Promise<User[]> {
    const documents = await UserModel.find(filter);
    const mapedUsers = documents.map((o) => o.toObject());
    return mapedUsers;
  }

  public async create(user: User) : Promise<User> {
    const documentCreated = await UserModel.create(user);
    const userCreated = documentCreated.toObject();
    return userCreated;
  }
}
