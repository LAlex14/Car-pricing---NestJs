import { promisify } from "util";
import { scrypt as _scrypt, randomBytes } from "crypto";

const scrypt = promisify(_scrypt);

/// hash the user password
export async function hashedPassword({ salt = '', password }): Promise<string> {
    if (!salt) {
        // generate a salt
        salt = randomBytes(8).toString('hex') // fwew43tr34f5gw4 -> 16 chars
    }
    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer

    // join the hashed result and salt together
    return `${salt}.${hash.toString('hex')}`
}