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
    Session, UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "./user.entity";
import { AuthGuard } from "../guards/auth.guards";

// @UseInterceptors(CurrentUserInterceptor) // to use interceptor locally
@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(body)
        session.userId = user.id
        return user;
    }

    @Post('/signin')
    async signIn(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(body)
        console.log(session)
        session.userId = user.id
        return user;
    }

    @UseGuards(AuthGuard)
    @Get('/whoami')
    async whoAmI(@CurrentUser() user: User) {
        return user
    }

    @Post('/signout')
    async signOut(@Session() session: any) {
        session.userId = null
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(+id)
        if (!user) {
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
