import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { userMock, userWithId } from "./utils/test.utils";
import { NotFoundException } from "@nestjs/common";

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>
  let users: User[] = []

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve(users.find(user => user.id === id))
      },
      find: (email: string) => {
        return Promise.resolve(users.filter(user => user.email === email))
      },
    }
    fakeAuthService = {
      signIn: (body) => {
        return Promise.resolve(body as User)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    users = [userMock]
    const [user] = await controller.findAllUsers(userMock.email)
    expect(user).toBeDefined()
    expect(user.email).toEqual(userMock.email)
  })

  it('findUser returns the user by given id', async () => {
    const id = 3
    users = [userWithId(id)]
    const user = await controller.findUser(`${id}`)
    expect(user).toBeDefined()
    expect(user.id).toEqual(3)
  })

  it('throws if an invalid id is given', async () => {
    const id = 7
    const user = controller.findUser(`${id}`)
    await expect(user).rejects.toThrow(NotFoundException);
  })

  it('signIn updates session object and returns user', async () => {
    const session: any = {};
    const logInUser = userMock
    const user = await controller.signIn(userMock, session)
    expect(user.id).toEqual(logInUser.id)
    expect(session.userId).toEqual(logInUser.id)
  })
});
