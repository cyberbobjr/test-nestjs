import {User} from './users-manager/entities/user.entity';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const environnement = {
    AUTH0_DOMAIN: 'assparis.eu.auth0.com',
    AUTH0_CLIENT_ID: 'ShykLWfE96z2XmJfsvcjVkSdIgzqOCds',
    AUTH0_CLIENT_SECRET: 'QwJ4nDwtprY2BwSnvlWljsmkQXp-8PDwakVnl9HceW_OUCuQDzqtgmqT6LUvISiq',
    production: true,
};

export const testingConfigOrm: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false,
};
