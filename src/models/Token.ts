import { Request, Response } from 'express';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm'; // decorators from typeorm
// import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import Orphanage from './Orphanage';
import User from './User';


const path = require('path');
const nodemailer = require('nodemailer');
// import * as nodemailer from'nodemailer';

const hbs = require('nodemailer-express-handlebars');

//decorators em typescript são uma função que retornam outra função, como no javascript
//a classe abaixo de @Entity funciona com parametro deuma segunda função, colada em @Entity

@Entity('tokens') //nome da tabela no banco, que este model representa 
export default class Token {
    // @PrimaryGeneratedColumn('increment')
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    token: string;
    

    @Column({
        type: "timestamp",        
      })
    tokenDate!: Date; //gravando criaçao do token agora, fazer extiração de 24 hrs no controlet como signin

    @Column()
    userName: string;

    @OneToOne(() => User, user => user.token, {
      cascade: ['insert' , 'update'] //
    })
    // @JoinColumn({name: "user_id"})
    user: User; 

    }