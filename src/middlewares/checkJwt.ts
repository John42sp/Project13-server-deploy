
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
  const { authorization } = req.headers;
  // console.log(authorization)

  if(!authorization) {
    return res.sendStatus(401)
  }
  const token = authorization.replace("Bearer", "").trim(); 

  try {
    const data = jwt.verify(token, process.env.NODE_ENV) as unknown;
   

    // console.log(data) // -> data = id, iat, exp, so needs to type data with interface
    const { id } = data as TokenPayload; 
    
    //save request info on Express -> see file express.d.ts, customized type declaration
    //telling express(req:Request) that userId is a  numero
    req.user_id  = id;  
  } catch {
    return res.sendStatus(401);
  }
  next();
}
