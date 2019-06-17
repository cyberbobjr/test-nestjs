import {CreateDateColumn, Entity, UpdateDateColumn, VersionColumn} from 'typeorm';

@Entity()
export class BaseEntity {
    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    modifiedAt: string;

    @VersionColumn()
    appVersion: string;
}
