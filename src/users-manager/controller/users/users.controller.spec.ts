import {Test, TestingModule} from '@nestjs/testing';
import {UsersController} from './users.controller';
import {AuthService} from '../../services/auth/auth.service';
import {HttpModule, NotFoundException} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {testingConfigOrm} from '../../../environnement';
import {User} from '../../entities/user.entity';
import {UserService} from '../../services/user/user.service';
import {getConnection} from 'typeorm';
import {UserToken} from '../../interfaces/UserToken';
import {UserTokenAdapter} from '../../adapters/UserTokenAdapter';

describe('Users Controller', () => {
    let controller: UsersController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                AuthService,
                UserService],
            imports: [
                HttpModule,
                TypeOrmModule.forRoot(testingConfigOrm),
                TypeOrmModule.forFeature([User]),
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        const conn = getConnection();
        return conn.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get user info with sub', async () => {
        const mockUser: User = new User();
        mockUser.sub = 'test';
        mockUser.email = 'ben.marchand@free.fr';
        mockUser.firstName = 'Benjamin';
        mockUser.lastName = 'Marchand';

        jest.spyOn(authService, 'getUserInfoWithSub')
            .mockImplementation(() => new Promise<User>(resolve => resolve(mockUser)));
        const loadedUser: User = await controller.getUserInfo(mockUser.sub);
        expect(loadedUser.sub).toEqual(mockUser.sub);
        expect(loadedUser.email).toEqual(mockUser.email);
    });

    it('should throw notfound exception if user sub not exist when getInfo', async () => {
        const mockUser: User = new User();
        mockUser.sub = 'test';
        mockUser.email = 'ben.marchand@free.fr';
        mockUser.firstName = 'Benjamin';
        mockUser.lastName = 'Marchand';

        jest.spyOn(authService, 'getUserInfoWithSub')
            .mockImplementation(() => new Promise<User>(resolve => resolve(undefined)));
        try {
            await controller.getUserInfo(mockUser.sub);
            expect(true).toBeFalsy();
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });

    it('should register user', async () => {
        const code = 'ABCDE';
        const mockUser: UserToken = {
            sub: 'test',
            email: 'ben.marchand@free.fr',
            name: 'test',
            given_name: 'Benjamin',
            family_name: 'Marchand',
        };
        jest.spyOn(authService, 'loginUser')
            .mockImplementation(() => new Promise<User>(resolve => resolve(UserTokenAdapter.convertToUser(mockUser))));

        const user: User = await controller.login(code);
        expect(user.lastName).toEqual(mockUser.family_name);
    });
});
