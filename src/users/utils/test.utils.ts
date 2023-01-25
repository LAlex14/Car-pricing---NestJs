import { User } from "../user.entity";

export const randId = Math.floor(Math.random() * 999999)

export const userAuthMock = {
    email: 'test@test.com',
    password: 'test'
} as User

export const userMock = {
    ...userAuthMock,
    id: randId,
} as User

export const userWithId = (id: number) => ({
    ...userAuthMock,
    id,
} as User)