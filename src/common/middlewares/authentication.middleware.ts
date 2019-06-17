import {Injectable, NestMiddleware} from '@nestjs/common';
import {expressJwtSecret} from 'jwks-rsa';
import jwt = require('express-jwt');
import {environnement} from '../../environnement';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        if (!environnement.production) {
            return next();
        }
        jwt({
            secret: expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://${environnement.AUTH0_DOMAIN}/.well-known/jwks.json`,
            }),

            audience: 'http://localhost:3000',
            issuer: `https://${environnement.AUTH0_DOMAIN}/`,
            algorithm: 'RS256',
        })(req, res, (err) => {
            if (err) {
                const status = err.status || 500;
                const message = err.message || 'Sorry, we were unable to process your request.';
                return res.status(status).send({
                    message,
                });
            }
            next();
        });
    }
}
