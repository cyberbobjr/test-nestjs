import {ProviderException} from '../exceptions/provider.exception';

export class PlaceFactory {
    static createFromProvider(provider: string): string {
        switch (provider) {
            case 'google' :
                return 'test';
            case 'fitdesk':
                return 'test3';
            default :
                throw new ProviderException();
        }
    }
}
