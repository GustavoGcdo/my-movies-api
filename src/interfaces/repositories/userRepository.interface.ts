import { User } from '../../models/entities/user';

export interface IUserRepository {
    find(filter: any): Promise<User[]>;
    create(user: User): Promise<User>;
}