import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { hashedPassword } from "./utils/users.utils";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async signUp({ email, password }: CreateUserDto) {
        ///  see if email is in use
        const [ user ] = await this.usersService.find(email)
        if (user) {
           throw new BadRequestException('email in use')
        }

        password = await hashedPassword({ password })

        /// create a new user and save it
        return await this.usersService.create({ email, password })
    }

    async signIn({ email, password }: CreateUserDto) {
        const [ user ] = await this.usersService.find(email)
        if (!user) {
            throw new BadRequestException('The email or password are wrong')
        }

        const [ salt ] = user.password.split('.')
        password = await hashedPassword({ salt, password })

        if (password !== user.password) {
            throw new BadRequestException('The email or password are wrong')
        }

        return user
    }
}