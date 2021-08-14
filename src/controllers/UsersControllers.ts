import { Request, Response } from 'express';
import { getRepository, UpdateDateColumn, getConnection, LessThan } from 'typeorm';
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

          if (!(email && password)) {
          console.error('Empty name or password!');
          return res.status(400).send({
            error: 'Empty name or password'
          });
          }

          const user = await userRepository.findOne({ where: { email } });
          console.log(user)
          if(!user) {
          return res.send(`User doesn t exist! `);
          }    
      
          if (!user.isVerified) {
            return res.send('Your Email has not been verified. Please do so!');  
          }
          let storedUserPass = user!.password;
          console.log(password)
          console.log(storedUserPass)
          
          const isValidPassword = await bcrypt.compareSync(password, storedUserPass);
          console.log(isValidPassword)     
          

          if(!isValidPassword) {
          return res.status(401).send('Password doesn t match')
          }
          else {
              
          // Sing JWT, valid for 1 hour
          const token = jwt.sign(
          { id: user.id, email: user.email }, 
          process.env.NODE_ENV,    
          // config.jwtSecret,      
          { expiresIn: "1d" }
          );
          res.json({
          user,
          token
          });
          }

      },


    async changepass(req: Request, res: Response){

      const userRepository = getRepository(User);
      
        // Get parameters from the body
        const { email, password, newPassword } = req.body;

        if (!(email && password && newPassword)) {
        res.status(409).send();
        }

        const user = await userRepository.findOne({ where: { email } });
        console.log(user)
        console.log('from 89')
        // console.log(user?.id)

        if(!user) {
          return res.sendStatus(401);
        }

      

        // Check if old password matches
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(400).send();
        return;
        }

        // Validate the model (Password length)
        user.password = newPassword;
        userRepository.save(user); 
        // console.log(user)


        res.status(204).send('Senha alterada com sucesso!');
        },


    async index(req: Request, res: Response){
      // return res.send('ok');

        //Get users from database

        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "name", "role"], 
            relations: ["orphanages", "token"]
        });

        //Send the users object
        console.log(users)
        res.send(users);
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
            res.json(user)
        } catch (error) {
            res.status(404).send("User not found");
        }        

    },

    async create(req: Request, res: Response) {      
  
        const verificationToken = await crypto.randomBytes(10).toString('hex');
        const { name, email, password, role, isVerified } = req.body;
        // const date = "2021-02-04T17:16:12.887Z"
        const date = new Date();
        // const updatedAt = createdAt;
        // console.log(date);       

        
        try {
          const userRepository = getRepository(User);       
          const tokenRepository = getRepository(Token); 
          
  
          //User validation
            const data = {
              name,
              email,
              password,
              // role,
              // isVerified,
              // date                       
            }    

           
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório.').max(60),
                email: Yup.string().email("Email inválido.").required(),
                password: Yup.string().required().min(4).max(10), 
            })
  
            await schema.validate(data, {
                abortEarly: false
            });       
  
          const userExists = await userRepository.findOne({ where: { email }})

        if(userExists) {  //linha abaixo não funciona: ou status, ou mensssagem
          // return res.sendStatus(409).json( {message: "User already exists, please try again!"});
          return res.send(`Usuário com email cadastrado ${email} já existe!` );

        } else {
          //ou const tokens
          const token = tokenRepository.create({token: verificationToken, tokenDate: date, userName: name})
          console.log(req.body)
          console.log(token)
          await tokenRepository.save(token);      
          console.log(token)
          const hashedPass = await bcrypt.hashSync(password, 8);
          console.log(hashedPass)
          //optei por fazer hash do password aqui, se fizer na função no model, executara de novo na verificação, e altera password, impedindo login.
          const user =  userRepository.create({ 
                                                name, 
                                                email, 
                                                password: hashedPass, 
                                                role: role || "basic", 
                                                isVerified: isVerified === "false",
                                                date, 
                                                token
                                                // token: [token], //aqui fica como esta, tenta mudar somente os outros
                                              })
          // console.log(password)
          // console.log(user.password)
          console.log(user)
          
          await userRepository.save(user); //finalmente criado no banco / save() insere no banco
          console.log(user)     

          
              return new Promise((resolve,reject)=>{
                const transp = transport;
                var mailOptions = {
                  from: 'Administrador <21a5de3598-58f3b9@inbox.mailtrap.io>',
                  to: email,
                  subject: 'Account verification link!',
                  // html: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users/confirmation\/' + user.email + '\/' + verificationToken + '\n\nThank You!\n'

                  html: `<h2>Olá ${user.name}</h2><br/>
                  <p>Finalize o seu cadastro clicando neste <a href="http://${req.headers.host}/users/confirmation/${user.email}/${verificationToken}" target="_about"  style="color: blue, text-derocation: none"}>Link</a>`
                  
                }
            
              //  let resp=false;
               
               transp.sendMail(mailOptions, function(error: Err){
                   if (error) {
                      //  console.log("error is "+ error);
                      return res.status(500).send({msg:'Technical Issue!,Please click on resend for verify your Email.'});
                      // resolve(false); // or use rejcet(false) but then you will have to handle errors
                   } 
                  else {
                    return res.send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
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
            console.log(user)       
            return res.status(200).send('Your account has been successfully verified')
          }
        }
      } catch(err) {
        return res.status(500).send({err: "Sorry, it could not be validated!"});
      }
        
    },    
 // resendToken não implementada, não consegui implementar salvar e apagar somente o token, sem apagar user junto
    async resendToken(req: Request, res: Response) {
      const userRepository = getRepository(User);  
      const tokenRepository = getRepository(Token);  
      const date = Date();
      const { email } = req.body;
      
      const user = await userRepository.findOne({where: { email }})
      if (!user){
        return res.status(400).send({msg:'We were unable to find a user with that email. Make sure your Email is correct!'});
    }
      // user has been already verified
      else if (user.isVerified){
          return res.status(200).send('This account has been already verified. Please log in.');

      } else {
        //PRIMEIRO, DELETAR  TOKENS ANTIGOS
        await tokenRepository
        .createQueryBuilder()
        .delete()
        .from(Token)
        .where("userName = :name", { name: user.name })
        .execute();
        

        const newGeneratedToken = await crypto.randomBytes(10).toString('hex');        

        const token = tokenRepository.create({ token: newGeneratedToken, tokenDate: date, userName: user.name })
        tokenRepository.save(token)
        console.log(token)


        user.token = token as any;
        userRepository.save(user);
        
          const transp = transport;

          transp.sendMail({
            from: 'Administrador <c3e26a9df0-703049@inbox.mailtrap.io>',
            to: email,
            subject: 'New account verification link!',
            text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + newGeneratedToken + '\n\nThank You!\n'
            }).then(
              () => {
                return res.status(200).json({ message: 'Email sent!'})
              }
            ).catch(
              () => {
                return res.status(404).json({ message: 'User not found!'})
              }
            )         
        

          // return res.json(user).send('Usuario cadastrado com sucesso!');
          return res.send(`Quase pronto, ${user.name}! Enviamos um email de verificação para finalizar seu cadastro!`)

      }
    },

    //password reset
    async forgotpass(req: Request, res: Response) {
      const { email } = req.body;        

      try {
        const userExists = await getRepository(User).find({ where: { email }})
        // console.log(userExists)
        if(!userExists) {
          return res.status(400).send({ error: "User not found."})
        }

        const transp = transport;
        const newPassword = crypto.randomBytes(10).toString('hex');
   
        transp.sendMail({
          from: 'Administrador <c3e26a9df0-703049@inbox.mailtrap.io>',
          to: email,
          subject: 'Recuperação de senha!',
          html: `<h2>Recuperação de senha</h2><br/>
          <p>Sua nova senha para acessar o sistema é: <strong>${newPassword}</strong></p><br/><a href="http://localhost:3000" style="color: blue, text-derocation: none"}>Login</a>`
        }).then(
          () => {
             bcrypt.hash(newPassword, 8).then(
               password => {
                getRepository(User).update(userExists[0].id, {
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

        try{
      

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