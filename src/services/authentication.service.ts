import { sign, verify } from 'jsonwebtoken';
import { promisify } from 'util';
import config from '../config';
const verifyAsync = promisify(verify);

export class AuthenticationService {
  public static generateToken(data: any) {
    return sign(data, config.SALT_KEY, { expiresIn: '1d' });
  }

  public static async verifyToken(token: string) {
    const tokenReplace = this.replaceToken(token);
    let data = await verifyAsync(tokenReplace, config.SALT_KEY);
    return data;
  }

  private static replaceToken(token: string) {
    const tokenReplace = token.replace('Bearer ', '');
    return tokenReplace;
  }
}
