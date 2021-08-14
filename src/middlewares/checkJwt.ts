
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

interface TokenPayload {
  id: number;
  iat: string;
  exp: string;
}

declare var process : {
  env: {
    NODE_ENV: string
  }
}

export default function checkJwt(req: Request, res: Response, next: NextFunction) {
  //authorization = token gerado do login, não é o token do registro do usuário
  const { authorization } = req.headers;
  console.log(authorization)

  if(!authorization) {
    return res.sendStatus(401)
  }
  const token = authorization.replace("Bearer", "").trim(); //apenas remover a palavra "Bearer" e espaço

  try {
    const data = jwt.verify(token, process.env.NODE_ENV) as unknown;
    // const data = jwt.verify(token, process.env.NODE_ENV) //junta token auth com menssagem secreta no .env

    console.log(data) // -> data traz no log o id, iat, exp, então tenho que tipar o data com interface
    const { id } = data as TokenPayload; 
    
    //salvar info da request no Express -> ver arquivo express.d.ts, fazer tipo customizado
    //preciso dizer pro express(req:Request) que o userId se trata de um numero, ver file express.d.ts declaration
    req.user_id  = id;  
    // console.log(id)
  } catch {
    return res.sendStatus(401);
  }
  next();
}

// // export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
// //   //Get the jwt token from the head
// //   const token = <string>req.headers["auth"];
// //   let jwtPayload;
  
// //   //Try to validate the token and get data
// //   try {
// //     jwtPayload = <any>jwt.verify(token, config.jwtSecret);
// //     res.locals.jwtPayload = jwtPayload;
// //   } catch (error) {
// //     //If token is not valid, respond with 401 (unauthorized)
// //     res.status(401).send();
// //     return;
// //   }

// //   //The token is valid for 1 hour
// //   //We want to send a new token on every request
// //   const { id } = jwtPayload;
// //   const newToken = jwt.sign({ id }, config.jwtSecret, {
// //     expiresIn: "1h"
// //   });
// //   res.setHeader("token", newToken);

// //   //Call the next middleware or controller
// //   next();
// // };