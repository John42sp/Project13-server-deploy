import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Orphanage from './Orphanage'

@Entity('videos')  //associando orphanages na tabela cdo banco com o model Image
export default class Video {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    path: string;

    @ManyToOne(() => Orphanage, orphanage => orphanage.videos)
    @JoinColumn({ name: 'orphanage_id'})
    orphanage: Orphanage;   

}