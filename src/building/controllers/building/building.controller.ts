import {Body, Controller, Get, Inject, Post} from '@nestjs/common';
import {ApiUseTags} from '@nestjs/swagger';
import {BuildingProvider} from '../../interfaces/building.provider';
import {BuildingProviderImp} from '../../providers/building.provider.imp';
import {BuildingDTO} from '../../DTO/BuildingDTO';
import {BuildingAdapter} from '../../adatpers/BuildingAdapter';
import {BuildingEntity} from '../../entities/building.entity';

@Controller('building')
@ApiUseTags('buildings')
export class BuildingController {

    constructor(@Inject('BuildingProviderImp') private buildingService: BuildingProvider) {
    }

    @Get('/')
    getList(): Promise<BuildingEntity[]> {
        return this.buildingService.getAllBuildings();
    }

    @Post('/')
    saveBuilding(@Body() buildingDTO: BuildingDTO): Promise<BuildingEntity> {
        return this.buildingService.saveBuilding(BuildingAdapter.fromDTO(buildingDTO));
    }
}
