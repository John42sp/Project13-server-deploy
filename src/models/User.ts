import { Request, Response } from 'express';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, createConnection } from 'typeorm'; // decorators from typeorm
// import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import Orphanage from './Orphanage';
import Token from './Token';


//decorators em typescript são uma função que retornam outra função, como no javascript
//a classe abaixo de @Entity funciona com parametro deuma segunda função, colada em @Entity

@Entity('users') //nome da tabela no banco, que este model representa (users)
export default class User {
    // @PrimaryGeneratedColumn('increment')
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



  //NÃO CONSEGUI INSERIR DATA DE CRIAÇÃO NO SQLITE: QueryFailedError: SQLITE_MISMATCH: datatype mismatch
  // Define como uma coluna de banco de dados que gravará a data/hora que o registro foi criado
    @Column({
      type: "timestamp"
    })
    date!: Date;

    @Column({
      default: false
    })
    isVerified: boolean;

   
//CUIDADO COM DECORATORS ABAIXO! SE NÃO TIVER FUNÇÃO, ABAIXO DELES, TBM DEVE REMOVE LOS, OU IMPEDIRÃO TRABALHO CONTROLERS
    // @BeforeInsert() //decorator pra executar função abaixo antes de inserir /save() no bando
    // @BeforeUpdate()  // p editar usuario
    // hashPassword() {  //função vai subscrever senha digitada no coampo acima, criptografada
    //   this.password = bcrypt.hashSync(this.password, 8); // salt de 8
    // }

  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    //RELACIONAMENTO DE USERS COM ORPHANAGES NO BANCO, ABAIXO, NAO SÃO COLUNAS PQ NÃO EXISTEM NO BANCO, APENAS RELACIONAMENTO


    @OneToMany(() => Orphanage, orphanage => orphanage.user, {
        cascade: ['insert' , 'update']
    })     
    @JoinColumn({ name: 'user_id'}) //colocando o id do user em cada orfanato (nome da coluna na tabela do banco)
    orphanages: Orphanage[];


    // @OneToOne(type => Token)
    // @JoinColumn()
    // token: Token;

    @OneToOne(() => Token, token => token.user, {
      // cascade: ['insert' , 'update'] //
    }) 
    @JoinColumn({name: "tokenId"})
    // token: Token[];
    token: Token;
    


    
}


