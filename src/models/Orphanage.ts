import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import Image from './Images';
import Video from './Videos';
import User from './User';

@Entity('orphanages')  //associando orphanages na tabela do banco com o model Orphanage
export default class Orphanage {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    about: string;

    @Column()
    instructions: string;

    @Column()
    opening_hours: string;

    @Column()
    open_on_weekends: boolean;

    @Column()
    user_id: number;

    @Column()
    user_name: string;   

    @OneToMany(() => Image, image => image.orphanage, {
    cascade: ['insert' , 'update']
    })
    @JoinColumn({ name: 'orphanage_id'})  //colocando o id da orphanage em cada imagem (nome da coluna na tabela do banco)
    images: Image[];


    @OneToMany(() => Video, video => video.orphanage, {
    cascade: ['insert' , 'update']
    })
    @JoinColumn({ name: 'orphanage_id'})  //colocando o id da orphanage em cada imagem (nome da coluna na tabela do banco)
    videos: Video[];


    @ManyToOne(() => User, user => user.orphanages)
    @JoinColumn({ name: 'user_id'}) 
    user: User;


}