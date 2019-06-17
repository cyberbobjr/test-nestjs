import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {HttpModule} from '@nestjs/common';
import {User} from '../../entities/user.entity';
import {UserService} from '../user/user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {getConnection} from 'typeorm';
import {UserToken} from '../../interfaces/UserToken';
import {testingConfigOrm} from '../../../environnement';
import {Token} from '../../interfaces/Token';

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UserService,
            ],
            imports: [
                HttpModule,
                TypeOrmModule.forRoot(testingConfigOrm),
                TypeOrmModule.forFeature([User]),
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        const conn = getConnection();
        return conn.close();
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('should add user with access token if user not exist', async () => {
        // tslint:disable-next-line:max-line-length
        const mockUser: UserToken = {
            sub: 'test',
            email: 'ben.marchand@free.fr',
            name: 'test',
            given_name: 'Benjamin',
            family_name: 'Marchand',
        };
        jest.spyOn(authService, 'getUserInfo').mockImplementation(() => Promise.resolve(mockUser));
        // tslint:disable-next-line:max-line-length
        const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5ETXhORVkwTXpJd016RTVNRVU1TkRFNE1qVTRSREk0TURrNVF6UXpPVGt4TkRVM09FSXdNZyJ9.eyJpc3MiOiJodHRwczovL2Fzc3BhcmlzLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1YzcxMWRlYTQ3M2YwNDUyZWE1NzMzODAiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9hc3NwYXJpcy5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTU4MTkwNDQ4LCJleHAiOjE1NTgyNzY4NDgsImF6cCI6IlNoeWtMV2ZFOTZ6MlhtSmZzdmNqVmtTZElnenFPQ2RzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.aw6qvkxAkbAnNP5wUmZ9P8V9pS3tn_M2jlOz9z_--oz4UZKKtp_Aw4wh06-aq5E2PmPmgrWczwBd2aZrlHIlnotTUy8OpMQ4yqlpYeXFVHev5qYFpwq-1C80yxAiE3Q8-oLD03WhXelbzUGwx4VZE7CJtwrGnmDRKMHPHGoUPQupxZ57y0LpxbEIsRCKKSIl_-a1YmXWqoNLhIr9IdIihMNQf9dWHRqhNeMXwZ6l9AhtWaDQuezLgdwILhwqaPVC4UwuSCRnXkGVwMCdeThZhouj9EbvXm561I_9r9jqtIt_5r3ttbikkl_DnL_b4JDsTmSLxUobMwDhdzQItT9SAQ';
        const user: User = await authService.getUserWithAccessToken(accessToken);
        expect(user).toBeDefined();
        const expected = {sub: 'test', email: 'ben.marchand@free.fr', firstName: 'Benjamin', lastName: 'Marchand'};
        const userFound: User = await userService.getUserBySub(mockUser.sub);
        expect(userFound.email).toEqual(expected.email);
    });

    it('should throw Error if Access Token expired or invalid', async () => {
        const accessToken = 'TEST';
        try {
            await authService.getUserWithAccessToken(accessToken);
            expect(true).toBeFalsy();
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    it('should decode access token', () => {
        // tslint:disable-next-line:max-line-length
        const accessToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5ETXhORVkwTXpJd016RTVNRVU1TkRFNE1qVTRSREk0TURrNVF6UXpPVGt4TkRVM09FSXdNZyJ9.eyJpc3MiOiJodHRwczovL2Fzc3BhcmlzLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1YzcxMWRlYTQ3M2YwNDUyZWE1NzMzODAiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9hc3NwYXJpcy5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTU4MTkwNDQ4LCJleHAiOjE1NTgyNzY4NDgsImF6cCI6IlNoeWtMV2ZFOTZ6MlhtSmZzdmNqVmtTZElnenFPQ2RzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.aw6qvkxAkbAnNP5wUmZ9P8V9pS3tn_M2jlOz9z_--oz4UZKKtp_Aw4wh06-aq5E2PmPmgrWczwBd2aZrlHIlnotTUy8OpMQ4yqlpYeXFVHev5qYFpwq-1C80yxAiE3Q8-oLD03WhXelbzUGwx4VZE7CJtwrGnmDRKMHPHGoUPQupxZ57y0LpxbEIsRCKKSIl_-a1YmXWqoNLhIr9IdIihMNQf9dWHRqhNeMXwZ6l9AhtWaDQuezLgdwILhwqaPVC4UwuSCRnXkGVwMCdeThZhouj9EbvXm561I_9r9jqtIt_5r3ttbikkl_DnL_b4JDsTmSLxUobMwDhdzQItT9SAQ';
        const expectPayload: any = {
            iss: 'https://assparis.eu.auth0.com/',
            sub: 'auth0|5c711dea473f0452ea573380',
            aud: [
                'http://localhost:3000',
                'https://assparis.eu.auth0.com/userinfo',
            ],
            iat: 1558190448,
            exp: 1558276848,
            azp: 'ShykLWfE96z2XmJfsvcjVkSdIgzqOCds',
            scope: 'openid profile email',
        };
        const token: any = AuthService.decodeAccessToken(accessToken);
        expect(expectPayload.sub).toEqual(token.sub);
    });

    it('should register user if not exist', async () => {
        // tslint:disable-next-line:max-line-length
        const code = 'vDSPDwAb-hD_BZKu';
        const mockUser: UserToken = {
            sub: 'test',
            email: 'ben.marchand@free.fr',
            name: 'test',
            given_name: 'Benjamin',
            family_name: 'Marchand',
        };
        const accessToken = {
            // tslint:disable-next-line:max-line-length max-line-length
            access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5ETXhORVkwTXpJd016RTVNRVU1TkRFNE1qVTRSREk0TURrNVF6UXpPVGt4TkRVM09FSXdNZyJ9.eyJpc3MiOiJodHRwczovL2Fzc3BhcmlzLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1YzcxMWRlYTQ3M2YwNDUyZWE1NzMzODAiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9hc3NwYXJpcy5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTU4MzY4MDU2LCJleHAiOjE1NTg0NTQ0NTYsImF6cCI6IlNoeWtMV2ZFOTZ6MlhtSmZzdmNqVmtTZElnenFPQ2RzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.CPMGEUcfQiM1WEnTi7iB6O2ih-MEu7gmqTJXPFeg76dec1STDPqzp4fv9Jbx4J9-aAoZIzW4R2Gk2FwqJ4Y4J52u2Fds1Xk_ObNYldeansB0y38Bdkmh_ue3jaOIybRPAcwOE41iyHokU4ogN88Mwid2PVp8k8mxxxwFfEjOREf-tN7nMfpxe0C50w8svqtSR4QAFlzORPlTf6c8NVGt_jLVzqEUIqirntGsEHgnHjBF0bQv9e2e1wVUzpUq46eX_gQuRmA5H3UiHowDqrfbSOlafmQosaBLA4k-fV4BHhUiF2VgCKG_oem3zpbtZXQAqKO8m7MpI3MjLyZZjxJHpQ',
            // tslint:disable-next-line:max-line-length max-line-length
            id_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5ETXhORVkwTXpJd016RTVNRVU1TkRFNE1qVTRSREk0TURrNVF6UXpPVGt4TkRVM09FSXdNZyJ9.eyJuaWNrbmFtZSI6ImJlbi5tYXJjaGFuZCIsIm5hbWUiOiJiZW4ubWFyY2hhbmRAZnJlZS5mciIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9iZDRiMWIyNmQ0MTZhNTJmZWFiNTZhYWQ3MWRiYjAwYz9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmJlLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDE5LTA1LTE3VDExOjM0OjU3LjIyN1oiLCJlbWFpbCI6ImJlbi5tYXJjaGFuZEBmcmVlLmZyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vYXNzcGFyaXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVjNzExZGVhNDczZjA0NTJlYTU3MzM4MCIsImF1ZCI6IlNoeWtMV2ZFOTZ6MlhtSmZzdmNqVmtTZElnenFPQ2RzIiwiaWF0IjoxNTU4MzY4MDU2LCJleHAiOjE1NTg0MDQwNTZ9.LEuEZ7xorVkdFhk1Bkf46kpL7nElA6MWLlFIWSrYhSa8s1BZE4N_xiz2hAIxN7QYaYUuRqyWqL8-OuuI9xlhYUnOfZrN7igKvmJylBTstln9hYn2t87lp7ruI2Mwqj5HQivtPT0hnDN9TQaT2J6HOKBjfJFL9M6IC9SaL42HAjxGuLzZTHBk4EyF2BFM6Bavb-81vM-rYxg_7x256NXXtummCcTibyecy8dKn29EZaaIm9XPGdOSqspQEi9FDPSWfxPBGxhftYf0VpHdevp7_8UCxUttDKMuOrygyPGURcSfcR5ORw9upMxT7jdLE_pZm85xPtQHvQDo1n97Ofu1cA',
            scope: 'openid profile email',
            expires_in: 86400,
            token_type: 'Bearer',
        };
        const userInfo = {
            sub: 'auth0|5c711dea473f0452ea573380',
            nickname: 'ben.marchand',
            name: 'ben.marchand@free.fr',
            picture: 'https://s.gravatar.com/avatar/bd4b1b26d416a52feab56aad71dbb00c?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fbe.png',
            updated_at: '2019-05-17T11:34:57.227Z',
            email: 'ben.marchand@free.fr',
            email_verified: true,
        };
        jest.spyOn(authService, 'getAccessTokenWithCode')
            .mockImplementation(() => new Promise<Token>(resolve => resolve(accessToken)));
        jest.spyOn(authService, 'getUserInfo')
            .mockImplementation(() => new Promise<UserToken>(resolve => resolve(mockUser)));

        const user: User = await authService.loginUser(code);
        expect(user.lastName).toEqual(mockUser.family_name);
        expect(user.sub).toEqual(mockUser.sub);
    });

});
