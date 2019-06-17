import {Injectable} from '@nestjs/common';
import {BuildingProvider} from '../interfaces/building.provider';
import {BuildingEntity} from '../entities/building.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class BuildingProviderImp implements BuildingProvider {

    constructor(@InjectRepository(BuildingEntity)
                private readonly buildingEntityRepository: Repository<BuildingEntity>) {
    }

    getAllBuildings(): Promise<BuildingEntity[]> {
        return this.buildingEntityRepository.find();
    }

    saveBuilding(building: BuildingEntity): Promise<BuildingEntity> {
        return this.buildingEntityRepository.save(building);
    }
}
