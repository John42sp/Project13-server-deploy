import { Request, Response } from 'express';
import { getRepository, UpdateDateColumn, getConnection, LessThan } from 'typeorm';
// import * as jwt from "jsonwebtoken";
// import { validate } from "class-validator";
import config from "../config/config";
import User from '../models/User';
import Token from '../models/Token';
// import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';
import transport  from '../modules/mailer';
const crypto = require('crypto'); //crypto vem com node
import * as bcrypt from 'bcryptjs';
const cron = require('node-cron');


export default {

    async index(req: Request, res: Response){
        //   const tokenRepository = getRepository(Token);
        //   const tokens = await tokenRepository.find();

        const tokens = await getRepository(Token)
            .createQueryBuilder("tokens")
            .getMany();
  
          //Send the users object
          console.log(tokens)
          res.send(tokens);
      },
  
      // async  delete(req: Request, res: Response){
      //   //Schedule tasks to be run on the server.

      //   // cron.schedule('* * * * * *', function() {
      //   //   console.log('running a task every minute');
      //   // })

      //     try {
      //       const tokenRepository = await getRepository(Token);
      //       //delTime = 24hrs atras
      //       // var delTime = new Date();
            
      //       // delTime.setDate( delTime.getDate() - 3 );
      //       // console.log(delTime)
      
      //             //.where("tokenDate = :time", { time: delTime })          
      //           //Switch on TypeOrm Query Logging to see the generated SQL, maybe you will be able to see what's going wrong. Paste the generated SQL into the SQL query console to debug.
      
      //             //'.where("tokenDate <= DateTime('Now', '-4 Day')")'
      //             //Note 2: This syntax is specific to Sqlite, you can do the same in other databases but the syntax is different, e.g. Microsoft SQL Server:                        
      
      //                  cron.schedule('* * * * * *', function() {
      //                 console.log('running a task every minute'); 
      //                 tokenRepository
      //               .createQueryBuilder()
      //               .delete()
      //               .from(Token)
      //               //.where("tokenDate = :time", { time: delTime })
      //               .where("tokenDate <= DateTime('Now', '-1 Day')")
      //               .execute();     })      
              
        
      //       } catch (error) {
      //           res.status(404).send("Tokens not found");
      //           return;
      //       }
        
      //       //After all send a 204 (no content, but accepted) response
      //       res.status(200).send('Token deleted successfuly');
          
        
      //     }   

}