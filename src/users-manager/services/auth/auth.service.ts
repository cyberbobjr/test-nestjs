import {HttpException, HttpService, Inject, Injectable} from '@nestjs/common';
import {environnement} from '../../../environnement';
import {Token} from '../../interfaces/Token';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {UserToken} from '../../interfaces/UserToken';
import {UserService} from '../user/user.service';
import {User} from '../../entities/user.entity';
import * as jwtDecode from 'jwt-decode';
import {UserTokenAdapter} from '../../adapters/UserTokenAdapter';

@Injectable()
export class AuthService {

    constructor(private httpClient: HttpService,
                @Inject(UserService) private userService: UserService) {
    }

    static decodeAccessToken(accessToken: string): any {
        if (accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.substring(accessToken.indexOf('Bearer '));
        }
        return jwtDecode(accessToken);
    }

    private getAccessTokenWithCode(code: string): Promise<Token> {
        const endpoint: string = `https://${environnement.AUTH0_DOMAIN}/oauth/token`;
        return this.httpClient.post<any>(endpoint, {
            grant_type: 'authorization_code',
            client_id: environnement.AUTH0_CLIENT_ID,
            client_secret: environnement.AUTH0_CLIENT_SECRET,
            code,
            redirect_uri: 'http://localhost:4200',
        })
                   .toPromise()
                   .then((response: AxiosResponse<Token>) => {
                       return response.data;
                   })
                   .catch((err) => {
                       throw new HttpException(err.response.data, err.response.status);
                   });
    }

    getUserInfoWithSub(sub: string): Promise<User> {
        return this.userService
                   .getUserBySub(sub);
    }

    private getUserInfo(accessToken: string): Promise<UserToken> {
        const endpoint: string = `https://${environnement.AUTH0_DOMAIN}/userinfo`;
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        };
        return this.httpClient.get<any>(endpoint, config).toPromise()
                   .then((response: AxiosResponse<UserToken>) => {
                       return response.data;
                   })
                   .catch((err) => {
                       throw new HttpException(err.response.data, err.response.status);
                   });
    }

    private getUserWithAccessToken(accessToken: string): Promise<User> {
        const userPayload: any = AuthService.decodeAccessToken(accessToken);
        return this.getUserInfoWithSub(userPayload.sub)
                   .then((user: User | undefined) => {
                       return user ? user : this.createUserWithAccessToken(accessToken);
                   });
    }

    async loginUser(code: string): Promise<User> {
        const token: Token = await this.getAccessTokenWithCode(code);
        return this.getUserWithAccessToken(token.access_token);
    }

    private createUserWithAccessToken(accessToken: string): Promise<User> {
        return this.getUserInfo(accessToken)
                   .then((userToken: UserToken) => {
                       const user: User = UserTokenAdapter.convertToUser(userToken);
                       return this.userService.saveUser(user);
                   });
    }

}
