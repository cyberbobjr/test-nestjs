import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigService} from './config/services/ConfigService';

const config = new ConfigService().read();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: __dirname + '/' + config.TYPEORM_DATABASE,
            synchronize: true,
            logging: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
        })],
})
export class DatabaseModule {

    constructor() {
    }
}
