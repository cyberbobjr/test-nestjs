import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from './user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {getConnection} from 'typeorm';
import {User} from '../../entities/user.entity';
import {UserToken} from '../../interfaces/UserToken';
import {UserTokenAdapter} from '../../adapters/UserTokenAdapter';
import {testingConfigOrm} from '../../../environnement';
import {ActivityException} from '../../../common/exceptions/ActivityException';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(testingConfigOrm),
                TypeOrmModule.forFeature([User]),
            ],
            providers: [
                UserService,
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        const conn = getConnection();
        return conn.close();
    });

    function createUser(): User {
        const user: User = new User();
        user.email = 'ben.marchand@free.fr';
        user.lastName = 'Marchand';
        user.firstName = 'Benjamin';
        return user;
    }

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return undefined if user sub not exist', () => {
        expect(service.getUserBySub('test')).resolves.toBeUndefined();
    });

    it('should save user', () => {
        const userToken: UserToken = {
            sub: 'google-oauth2|107516408211914817455',
            given_name: 'Benjamin',
            family_name: 'MARCHAND',
            nickname: 'cyberbobjr',
            name: 'Benjamin MARCHAND',
            email: 'cyberbobjr@gmail.com',
            picture: 'https://lh3.googleusercontent.com/-lZlVY24dUdI/AAAAAAAAAAI/AAAAAAAADlA/xFmw9ehgjK8/photo.jpg',
            updated_at: '2019-05-17T11:23:48.871Z',
        };
        const user: User = UserTokenAdapter.convertToUser(userToken);
        expect(service.saveUser(user)).resolves.toBeDefined();
    });

    it('should not save user if invalid fields', (done) => {
        const user: User = new User();
        service.saveUser(user)
               .then(() => {
                   expect(true).toBeFalsy();
               })
               .catch((err) => {
                   expect(err.toString()).toContain('email');
                   done();
               });
    });

    it('should get User by Id', async () => {
        const user: User = createUser();

        const userSaved: User = await service.saveUser(user);

        const userLoaded: User = await service.getUserById(userSaved.id);
        expect(userLoaded.firstName).toEqual(user.firstName);
        expect(userLoaded.lastName).toEqual(user.lastName);
    });

    it('should not add user if email already exist', async () => {
        const user1: User = createUser();
        const user2: User = createUser();

        try {
            await service.saveUser(user1);
            await service.saveUser(user2);
            expect(true).toBeFalsy();
        } catch (e) {
            expect(e).toBeInstanceOf(ActivityException);
        }
    });
});
