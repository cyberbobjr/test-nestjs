import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from '../../common/entities/BaseEntity';

@Entity()
export class BuildingEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255, nullable: false})
    name: string;

    @Column({length: 255, nullable: false})
    placeId: string;

    @Column({length: 255, nullable: true, unique: true, comment: 'Google\'s buildingId'})
    resourceId: string;

    @Column({type: 'varchar', nullable: false})
    provider: string;

    @Column({type: 'text', nullable: true})
    image: string;
}
