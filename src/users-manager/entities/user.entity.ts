import {Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {IsEmail, IsNotEmpty} from 'class-validator';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({nullable: true})
    password: string;

    @Column({nullable: true})
    picture: string;

    @IsNotEmpty()
    @Column({nullable: false, unique: true})
    @IsEmail()
    email: string;

    @Column({nullable: true})
    mobilephone: string;

    @Column({nullable: true})
    sub: string;

    @Column({nullable: true})
    role: string;
}
