import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import   User   from '../models/User';
let user: User;

export const checkRoleSuper = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //in insomnia, test with Token, as it will contain the user_idsaved in checkJwt.js
    const { user_id } = req;


    //Get user role from the database
    const userRepository = getRepository(User);
   
    try {
      user = await userRepository.findOneOrFail(user_id);

    } catch (user_id) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};

export const checkRoleAdmin = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //in insomnia, test with Token, as it will contain the user_idsaved in checkJwt.js
    const { user_id } = req;


    //Get user role from the database
    const userRepository = getRepository(User);
   
    try {
      user = await userRepository.findOneOrFail(user_id);

    } catch (user_id) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > 0) next();
    else res.status(401).send();
  };
};