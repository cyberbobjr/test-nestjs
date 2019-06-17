import {BuildingEntity} from '../entities/building.entity';
import {BuildingDTO} from '../DTO/BuildingDTO';
import {PlaceFactory} from '../factories/PlaceFactory';

export class BuildingAdapter {
    static fromDTO(buildingDTO: BuildingDTO): BuildingEntity {
        const building: BuildingEntity = new BuildingEntity();
        building.name = buildingDTO.name;
        building.provider = buildingDTO.provider;
        building.placeId = PlaceFactory.createFromProvider(building.provider);
        return building;
    }
}
