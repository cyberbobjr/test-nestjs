import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {UsersManagerModule} from './users-manager/users-manager.module';
import {DatabaseModule} from './database.module';
import {AuthenticationMiddleware} from './common/middlewares/authentication.middleware';
import {AdminGuard} from './common/guards/AdminGuard';
import {BuildingModule} from './building/building.module';

@Module({
    imports: [
        UsersManagerModule,
        DatabaseModule,
        BuildingModule,
    ],
    controllers: [],
    providers: [
        AdminGuard,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(AuthenticationMiddleware)
                .exclude(
                    {
                        path: 'login',
                        method: RequestMethod.ALL,
                    },
                    {
                        path: '\/users\/getToken\/*',
                        method: RequestMethod.GET,
                    },
                    {
                        path: '\/buildings\/addBuildingldi\/*',
                        method: RequestMethod.POST,
                    },
                )
                .forRoutes({
                    path: '\/users\/getUserInfo',
                    method: RequestMethod.GET,
                });
    }
}
