import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {AuthService} from './services/auth/auth.service';
import {UsersController} from './controller/users/users.controller';
import {UserService} from './services/user/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        HttpModule,
    ],
    providers: [
        AuthService,
        UserService,
    ],
    controllers: [UsersController],
})
export class UsersManagerModule {

}
