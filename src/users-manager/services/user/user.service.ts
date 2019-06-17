import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../entities/user.entity';
import {Repository} from 'typeorm';
import {UserToken} from '../../interfaces/UserToken';
import {UserTokenAdapter} from '../../adapters/UserTokenAdapter';
import {UsersApplication} from '../../applications/users.application';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    }

    getUserBySub(sub: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                sub,
            },
        });
    }

    async saveUser(user: User): Promise<User> {
        const errors = await UsersApplication.isValid(user, this.userRepository);
        if (errors.length > 0) {
            throw new Error(`Validation failed! ${errors}`);
        }
        return this.userRepository.save(user);
    }

    findOrCreate(userToken: UserToken): Promise<User> {
        return new Promise((resolve, reject) => {
            this.userRepository.findOneOrFail({where: {sub: userToken.sub}})
                .then((userFound: User) => resolve(userFound))
                .catch(() => {
                    this.saveUser(UserTokenAdapter.convertToUser(userToken))
                        .then((userCreated: User) => resolve(userCreated))
                        .catch((err) => reject(err));
                });
        });
    }

    getUserById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne(id);
    }
}
