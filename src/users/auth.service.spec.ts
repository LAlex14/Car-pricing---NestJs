import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException } from "@nestjs/common";
import { userAuthMock } from "./utils/test.utils";



describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    const users: User[] = []

    beforeEach(async () => {
        // Create a fake copy of the users service
        fakeUsersService = {
            find: (email) => Promise.resolve(users.filter(user => user.email === email)),
            create: ({ email, password }: User) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password
                } as User
                users.push(user)
                return Promise.resolve(user)
            }
        }

        const module = await Test.createTestingModule({
            providers: [AuthService, {
                provide: UsersService,
                useValue: fakeUsersService
            }],
        }).compile()

        service = module.get(AuthService)
    })

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signUp(userAuthMock)

        expect(user.password).not.toEqual(userAuthMock.password)
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throws an error if user signs up with email that is in use', async () => {
        await expect(service.signUp(userAuthMock)).rejects.toThrow(BadRequestException);
    })

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signIn({
            ...userAuthMock,
            email: 'lala@test.com'
        })).rejects.toThrow(BadRequestException);
    })

    it('throws if an invalid password is used', async () => {
        await expect(service.signIn({
            ...userAuthMock,
            password: 'pass'
        })).rejects.toThrow(BadRequestException);
    })

    it('return a user if correct data is provided', async () => {
        const user = await service.signIn(userAuthMock)
        expect(user).toBeDefined()
    })
})

// DI container