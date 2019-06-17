import {Test, TestingModule} from '@nestjs/testing';
import {BuildingProviderImp} from './building.provider.imp';

describe('BuildingProvider', () => {
    let provider: BuildingProviderImp;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BuildingProviderImp],
        }).compile();

        provider = module.get<BuildingProviderImp>(BuildingProviderImp);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });

    it('should return buildings', () => {

    });
});
