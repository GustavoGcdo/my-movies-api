import { Profile } from './profile';
export interface User {
  _id: string;
  email: string;
  birthday: Date;
  password: string;  
  profiles: Profile[]
  socialLogin?: {facebookId: number}
}
