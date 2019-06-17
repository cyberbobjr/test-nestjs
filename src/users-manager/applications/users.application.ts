import {User} from '../entities/user.entity';
import {validate, ValidationError} from 'class-validator';
import {Repository} from 'typeorm';

export class UsersApplication {
    static async isValid(user: User, repository: Repository<User>): Promise<ValidationError[]> {
        const errors = await validate(user);

        if (await UsersApplication.isConditionExist({email: user.email}, repository)) {
            errors.push({property: 'email', children: null, constraints: {['email']: 'Email already exist'}});
        }
        return errors;
    }

    private static async isConditionExist(conditions: any, repository: Repository<User>): Promise<boolean> {
        const count: number = await repository.count({where: conditions});
        return count > 0;
    }
}
