import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {
    }

    create(body: CreateUserDto) {
        const user = this.repo.create(body)
        return this.repo.save(user)
    }
}
