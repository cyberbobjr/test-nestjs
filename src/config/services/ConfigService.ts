import * as dotenv from 'dotenv';
import * as fs from 'fs';

export interface EnvData {
    // application
    APP_ENV: string;
    APP_DEBUG: boolean;

    // database
    DB_TYPE: any;
    DB_HOST?: string;
    DB_NAME: string;
    DB_PORT?: number;
    DB_USER: string;
    DB_PASSWORD: string;
    TYPEORM_ENTITIES: string;
    TYPEORM_DATABASE: string;
}

export class ConfigService {
    private vars: EnvData;

    private readonly envConfig: { [key: string]: string };

    constructor() {
        const environment = process.env.NODE_ENV || 'dev';
        const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
        data.APP_ENV = environment;
        data.APP_DEBUG = data.APP_DEBUG === 'true';
        data.DB_PORT = parseInt(data.DB_PORT, 10);

        this.vars = data as EnvData;
    }

    read(): EnvData {
        return this.vars;
    }

    isDev(): boolean {
        return (this.vars.APP_ENV === 'development');
    }

    isProd(): boolean {
        return (this.vars.APP_ENV === 'production');
    }
}
