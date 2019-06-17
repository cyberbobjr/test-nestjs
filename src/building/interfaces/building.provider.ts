import {BuildingDTO} from '../DTO/BuildingDTO';
import {BuildingEntity} from '../entities/building.entity';

export interface BuildingProvider {
    getAllBuildings(): Promise<BuildingEntity[]>;

    saveBuilding(buildingDTO: BuildingDTO): Promise<BuildingEntity>;
}
