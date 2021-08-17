import { request, response, Router } from 'express';
import multer from 'multer';
import OrphanagesController from './controllers/OrphanagesController';
import UserController from './controllers/UsersControllers';
import TokenController from './controllers/TokenController';

import  checkJwt   from './middlewares/checkJwt';  //will be called everytime it requires a logged user
import {checkRoleSuper, checkRoleAdmin  } from './middlewares/checkRole';
const cron = require('node-cron');



//import configs of file save destinations, limits and filter file types
import uploadConfig from './config/upload';
const storage = uploadConfig.storage;
const limits = uploadConfig.limits;
const filter = uploadConfig.fileFilter;

const routes = Router();

// let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

const upload = multer({storage: storage, limits: limits as any, fileFilter: filter as any});

const uploadsStorageFilterFields = upload.fields([{
                                        name: 'images', maxCount: 5
                                    }, {
                                        name: 'videos', maxCount: 3
                                    }])


//create user
routes.post('/users/new', UserController.create);

routes.get('/users/confirmation/:email/:token', UserController.confirmEmail);

routes.post('/users/resendtoken', UserController.resendToken);

//forgot password
routes.post('/users/forgotpass', UserController.forgotpass);


//change password route
// routes.post('/users/changepass', checkJwt, UserController.changepass);
routes.post('/users/changepass', UserController.changepass);

//login route
routes.post('/users/login', UserController.login);

//show user
routes.get('/users/:id', checkJwt, UserController.show);

//list users
routes.get('/users', checkJwt, UserController.index);

//delete user
routes.delete('/users/:id', [checkJwt, checkRoleSuper(['supervisor'])], UserController.delete);
routes.delete('/users/:id', checkJwt, UserController.delete);

//create orphanage
routes.post('/orphanages/create', uploadsStorageFilterFields, OrphanagesController.create);
routes.get('/orphanages', checkJwt, OrphanagesController.index);
routes.get('/orphanages/:id', checkJwt, OrphanagesController.show);
// routes.post('/orphanages/create', upload.array('images'), OrphanagesController.create);
routes.delete('/orphanages/:id', checkJwt, OrphanagesController.delete);

//exclusive routes for admin & supervisor:
routes.get('/tokens', [checkJwt, checkRoleAdmin(['admin'])], TokenController.index);


export default routes;
