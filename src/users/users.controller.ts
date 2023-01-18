import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
        await this.usersService.create(body)
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running')
        const user = await this.usersService.findOne(+id)
        if(!user) {
            throw new NotFoundException('user not found')
        }
        return user
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email)
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(+id, body)

    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.delete(+id)
    }
}
