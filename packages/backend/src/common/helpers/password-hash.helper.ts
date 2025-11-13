import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export default class PasswordHashHelper {
  /**
   * Hash a plain text password.
   * Returns the hashed password string.
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare a plain password against a hashed password.
   */
  static async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
