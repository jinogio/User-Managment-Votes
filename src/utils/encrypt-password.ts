import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

export class EncryptPassword {
  async encrypt(password: string, salt?: string) {
    salt = salt || randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 16)) as Buffer;
    const encryptedPassword = salt + '.' + hash.toString('hex');
    return encryptedPassword;
  }
}
