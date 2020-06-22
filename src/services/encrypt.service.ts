import md5 from 'md5';

export class EncryptService {
  public static encrypt(...value: string[]) {
    return md5(value.join(''));
  }
}
