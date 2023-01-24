import { Injectable, NotFoundException } from '@nestjs/common';
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

    findOne(id: number) {
        if (!id) {
            return null
        }
        return this.repo.findOneBy({ id })
    }

    find(email: string) {
        return this.repo.findBy({ email })
    }

    async update(id: number, attrs: Partial<User>) {
        let user = await this.repo.findOneBy({ id })
        if (!user) {
            throw new NotFoundException('user not found')
        }
        Object.assign(user, attrs)
        return this.repo.save(user)
    }

    async delete(id: number) {
        let user = await this.repo.findOneBy({ id })
        if (!user) {
            throw new NotFoundException('user not found')
        }
        return this.repo.remove(user)
    }
}

