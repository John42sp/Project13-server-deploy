import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm'; 
import Orphanage from './Orphanage';
import Token from './Token';


@Entity('users') 
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column({
      unique: true
    })
    email: string;

    @Column()
    password: string;
  
    @Column()
    role: string;
    default: 'basic'
    enum: ["basic", "supervisor", "admin"];

    @Column({
      type: "timestamp"
    })
    date!: Date;

    @Column({
      default: false
    })
    isVerified: boolean;

    @OneToMany(() => Orphanage, orphanage => orphanage.user, {
    cascade: ['insert' , 'update']
    })     
    @JoinColumn({ name: 'user_id'}) 
    orphanages: Orphanage[];


    @OneToOne(() => Token, token => token.user, {
      cascade: ['insert' , 'update'] //
    }) 
    @JoinColumn({name: "tokenId"})
    token: Token; 
}


