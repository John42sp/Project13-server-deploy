import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import * as jwt from "jsonwebtoken";
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


//tipagem de erro
interface Err {
  err: string
}

interface TokenType {
  id: number;
  token: string;
  tokenDate: Date;
  userName: string;
}

//tipagem de arquivo .env
declare var process : {
  env: {
    NODE_ENV: string
  }
}


export default {

      async login(req: Request, res: Response){
              // Get user from database
          const userRepository = getRepository(User);
          const { email, password } = req.body;

          try {
            if (!(email && password)) {
                return res.status(400).send({
                  error: 'Empty name or password'
                });
              }
    
              const user = await userRepository.findOne({ where: { email } });
                if(!user) {
                return res.status(400).send(`User doesn t exist!`);
              }    
          
              if (!user.isVerified) {
                return res.status(400).send('Your Email has not been verified. Please do so!');  
              }
              let storedUserPass = user!.password;             
              const isValidPassword = await bcrypt.compareSync(password, storedUserPass);              
    
              if(!isValidPassword) {
              return res.status(401).send('Password doesn t match')
              }
              else {
                  
              // Sing JWT, valid for 1 hour
              const token = jwt.sign(
                { id: user.id, email: user.email }, 
                // process.env.NODE_ENV,    
                config.jwtSecret,      
                { expiresIn: "1d" }
                );
                res.json({
                    user,
                    token
                  });
              }
            
          } catch (error) {
            return res.status(404).send({ error: "Something weird went wrong!."})
          }
      },


    async changepass(req: Request, res: Response){

        // Get parameters from the body
        const { password, newPassword } = req.body;
        const { id }  = req.headers;
        console.log(id)
         const userRepository = getRepository(User);      

      try {
        const user = await userRepository.findOne({ where: { id } }); 
      console.log(user)

        if (!(password || newPassword)) {
        res.status(409).send('Fields can not be empty.');
      }
   
        if(!user) {
        return res.sendStatus(401);
      }          

      //validate user current password input with stored password
      let storedUserPass = user!.password;              
      const isValidPassword = await bcrypt.compareSync(password, storedUserPass);
        if (!isValidPassword){
          res.status(400).send('Sorry, the password you typed is incorrect, try again.');
          return;
        }

      // Hash new password and replace / save it in user's reposotory
        const hashedNewPass = await bcrypt.hashSync(newPassword, 8);
        user.password = hashedNewPass;
        userRepository.save(user); 
        return res.send(`New password '${newPassword}' saved successfully!`);
        
      } catch (error) {
        res.status(404).send("Operation failed, try again");
      }


      },


    async index(req: Request, res: Response){

        //Get users from database
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "name", "role"], 
            relations: ["orphanages", "token"]
        });

        //Send the users object
        res.status(204).send(users);
    },

    async show(req: Request, res: Response){ 
        const id = req.params;
        //Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
            select: ["id", "name", "role"], //We dont want to send the password on response
            relations: [ "orphanages", "token"]
            });
            res.status(204).json(user)
        } catch (error) {
            res.status(404).send("User not found");
        }        

    },

    async create(req: Request, res: Response) {      
  
        const verificationToken = await crypto.randomBytes(10).toString('hex');
        const { name, email, password, role, isVerified } = req.body;
        const date = new Date();
           
        try {
          const userRepository = getRepository(User);       
          const tokenRepository = getRepository(Token); 
          
          if (!(name && email && password)) {
            res.status(409).send('Fields can not be empty.');
          }
          //User validation
            const data = {
              name,
              email,
              password                    
            }    
           
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório.').min(4).max(60),
                email: Yup.string().email("Email inválido.").required(),
                password: Yup.string().required().min(4).max(15), 
            })
  
            await schema.validate(data, {
                abortEarly: false
            });      
            
        const userExists = await userRepository.findOne({ where: { email }})
        if(userExists) {  //linha abaixo não funciona: ou status, ou mensssagem
          return res.sendStatus(409).json( {message: `Email ${email} already exists, please try again!`});

        } else {
          //ou const tokens
          const token = tokenRepository.create({token: verificationToken, tokenDate: date, userName: name})
         
          await tokenRepository.save(token);      
          const hashedPass = await bcrypt.hashSync(password, 8);
        
          const user =  userRepository.create({ 
                                                name, 
                                                email, 
                                                password: hashedPass, 
                                                role: role || "basic", 
                                                isVerified: isVerified === "false",
                                                date, 
                                                token                                             
                                              })
        
          
          await userRepository.save(user); //finalmente criado no banco / save() insere no banco
          
              return new Promise((resolve,reject)=>{
                const transp = transport;
                var mailOptions = {
                  from: 'Administrador <21a5de3598-58f3b9@inbox.mailtrap.io>',
                  to: email,
                  subject: 'Account verification link!',
                  // html: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users/confirmation\/' + user.email + '\/' + verificationToken + '\n\nThank You!\n'

                  html: `<h2>Hello ${user.name}</h2><br/>
                  <p>Please verify your account by clicking the link:  <a href="http://${req.headers.host}/users/confirmation/${user.email}/${verificationToken}" target="_about"  style="color: blue, text-derocation: none"}>Link</a>`
                  
                }
            
              //  let resp=false;
               
               transp.sendMail(mailOptions, function(error: Err){
                   if (error) {
                      //  console.log("error is "+ error);
                      return res.status(500).send({msg:'Technical Issue! Please click on resend to verify your Email.'});
                      // resolve(false); // or use rejcet(false) but then you will have to handle errors
                   } 
                  else {
                    return res.status(200).send('A verification email has been sent to ' + user.email + '. It will  expire in one day. In case you do not receive it, you may click Token resend.');
                      // console.log('Email sent: ' + info.response);
                      // resolve(true);
                   }
                  });
                })  
               
               }

      } catch(err) {
        return res.status(404).send({ err: "Failed to send email."})
      }    
    },

    async confirmEmail(req: Request, res: Response) {
      try {
        const userRepository = getRepository(User);  
        const tokenRepository = getRepository(Token);  
  
        const tokenExists = await tokenRepository.findOne({ token: req.params.token });    
        tokenExists!.tokenDate 
  
        if( !tokenExists ) {
          return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
        } else {
          
         const user = await userRepository.findOne({where: { token: tokenExists,  email: req.params.email }})

         //user not exist
          if(!user) {
            return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});

          } // user is already verified
          else if (user.isVerified){
              return res.status(200).send('User has been already verified. Please Login');

          } else { //verify user
            user.isVerified = true;
            await userRepository.save(user);
            return res.status(200).send('Your account has been successfully verified')
          }
        }
      } catch(err) {
        return res.status(500).send({err: "Sorry, it could not be validated!"});
      }
        
    },    
    async resendToken(req: Request, res: Response) {
      const { email } = req.body;

      if (!(email)) {
        res.status(409).send('Field can not be empty.');
      }

      const userRepository = getRepository(User);  
      const tokenRepository = getRepository(Token);  
      let oldToken;
      const date = Date();
      
      try {
        //find user
        const user = await userRepository.findOne({where: { email }});
        //find user's token to be deleted
        oldToken = await tokenRepository.findOne({where: { userName: user?.name }});
        if (!user){
          return res.status(400).send({msg:'We were unable to find a user with that email. Make sure your email is correct!'});
      }
        // user has already been verified
        else if (user.isVerified){
            return res.status(200).send('This account has already been verified. Please log in.');
  
        } else {           
        // tokenRepository.delete(oldToken); //note: it s not deleting old tokens, just replacing user's token

          //generate new token and saving it
          const newGeneratedToken = await crypto.randomBytes(10).toString('hex');        
  
          const newToken = tokenRepository.create({ token: newGeneratedToken, tokenDate: date, userName: user.name })
          await tokenRepository.save(newToken)
  
          //passing new token to user and saving 
          user.token = newToken;
          await userRepository.save(user);
          

              return new Promise((resolve,reject)=>{
                const transp = transport;
                var mailOptions = {
                  from: 'Administrador <21a5de3598-58f3b9@inbox.mailtrap.io>',
                  to: email,
                  subject: 'New account verification link!',
              
                  html: `<h2>Hello ${user.name}</h2><br/>
                  <p>Please verify your account by clicking  <a href="http://${req.headers.host}/users/confirmation/${user.email}/${newGeneratedToken}" target="_about"  style="color: blue, text-derocation: none"}>Link</a>`                  
                }            
               
               transp.sendMail(mailOptions, function(error: Err){
                   if (error) {
                      //  console.log("error is "+ error);
                      return res.status(500).send({msg:'Technical Issue! Please click on resend to verify your Email.'});
                   } 
                  else {
                    return res.status(200).send('A verification email has been sent to ' + user.email + '. It will  expire in one day. In case you do not receive it, you may hit Token resend.');
                   }
                  });
                })  
        }
        
      } catch (error) {
        return res.status(404).send({ error: "Something weird went wrong!."})
      }   
    },

    //password reset
    async forgotpass(req: Request, res: Response) {
      const { email } = req.body;        

      try {
        const userExists = await getRepository(User).findOne({ where: { email }})
        console.log(userExists)
        if(!userExists) {
          return res.status(400).send({ error: "User not found."})
        }

        const transp = transport;
        const newPassword = crypto.randomBytes(10).toString('hex');
   
        transp.sendMail({
          from: 'Administrador <c3e26a9df0-703049@inbox.mailtrap.io>',
          to: email,
          subject: 'Password recovery',
          html: `<h2>Password recovery!</h2><br/>
          <p>Your new password to access the site is: <strong>${newPassword}</strong></p><br/><a href="http://localhost:3000" style="color: blue, text-derocation: none"}>Login</a>`
        }).then(
          () => {
             bcrypt.hash(newPassword, 8).then(
               password => {
                getRepository(User).update(userExists.id, {
                  password
                }).then(
                  () => {
                    return res.status(200).json({ message: 'Email sent!'})
                  }
                ).catch(
                  () => {
                    return res.status(404).json({ message: 'User not found!'})
                  }
                )
               }
             )
          }
        )

      } catch (err) {
        return res.status(404).send({ error: "Failed to send email."})
      }

  },

    async delete(req: Request, res: Response){        
      
        const userRepository = getRepository(User);
        // const userName = "Anew";
        const delDate = new Date();      
        delDate.setDate( delDate.getDate() - 3)
        // delDate.toISOString();
        console.log(delDate)

        try {     

          await userRepository
          .createQueryBuilder()
          .delete()
          .from(User)
          // .where("name = :name", { name: userName })
          .where("date <= :delDate", { delDate: "2021-02-08T17:59:48.485Z" }) 
          .execute();
 
        } catch(error) {
          res.status(404).send("User not found");
          return;
        }
        
        // res.status(200).send(`User ${userName} deleted successfuly`);
        res.status(200).send('All users registered 8 days ago were deleted successfuly');        
    },  
}