import {UserToken} from '../interfaces/UserToken';
import {User} from '../entities/user.entity';

export class UserTokenAdapter {
    static convertToUser(userToken: UserToken): User {
        const userCreated: User = new User();
        userCreated.email = userToken.email;
        userCreated.sub = userToken.sub;
        if (userToken['http://localhost:3000/roles']) {
            userCreated.role = userToken['http://localhost:3000/roles'][0];
        }

        if (userToken.given_name) {
            userCreated.firstName = userToken.given_name;
        }
        if (userToken.family_name || userToken.name) {
            userCreated.lastName = userToken.family_name || userToken.name;
        }
        if (userToken.picture) {
            userCreated.picture = userToken.picture;
        }
        return userCreated;
    }
}
