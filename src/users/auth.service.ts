import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { promisify } from "util";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { CreateUserDto } from "./dtos/create-user.dto";

const scrypt = promisify(_scrypt);

async function hashedPassword({ salt, password }): Promise<string> {
    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer

    // join the hashed result and salt together
    return `${salt}.${hash.toString('hex')}`
}

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async signUp({ email, password }: CreateUserDto) {
        ///  see if email is in use
        const [ user ] = await this.usersService.find(email)
        if (user) {
           throw new BadRequestException('email in use')
        }

        /// hash the user password
        // generate a salt
        const salt = randomBytes(8).toString('hex') // fwew43tr34f5gw4 -> 16 chars

        password = await hashedPassword({ salt, password})

        /// create a new user and save it
        return await this.usersService.create({ email, password })
    }

    async signIn({ email, password }: CreateUserDto) {
        const [ user ] = await this.usersService.find(email)
        if (!user) {
            throw new BadRequestException('The email or password are wrong')
        }

        const [ salt ] = user.password.split('.')
        password = await hashedPassword({ salt, password})

        if (password !== user.password) {
            throw new BadRequestException('The email or password are wrong')
        }

        return user
    }
}