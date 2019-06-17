import {HttpException, HttpStatus} from '@nestjs/common';

export class ProviderException extends HttpException {
    constructor() {
        super('Bad parameters for Provider', HttpStatus.BAD_REQUEST);
    }
}
