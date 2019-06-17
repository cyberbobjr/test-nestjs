import {Module} from '@nestjs/common';
import {BuildingController} from './controllers/building/building.controller';
import {BuildingProviderImp} from './providers/building.provider.imp';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BuildingEntity} from './entities/building.entity';

@Module({
    controllers: [
        BuildingController,
    ],
    providers: [
        BuildingProviderImp,
    ],
    imports: [
        TypeOrmModule.forFeature([BuildingEntity]),
    ],
})
export class BuildingModule {
}
