import {Controller, Get, NotFoundException, Param} from '@nestjs/common';
import {AuthService} from '../../services/auth/auth.service';
import {ApiUseTags} from '@nestjs/swagger';
import {User} from '../../entities/user.entity';

@ApiUseTags('users')
@Controller('/users')
export class UsersController {

    constructor(private authService: AuthService) {
    }

    @Get('/getUserInfo/:sub')
    async getUserInfo(@Param('sub') sub: string): Promise<User> {
        const user: User = await this.authService.getUserInfoWithSub(sub);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get('/login/:code')
    login(@Param('code') code: string) {
        return this.authService.loginUser(code);
    }
}
