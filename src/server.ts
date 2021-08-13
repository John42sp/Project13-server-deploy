

import path from 'path';
import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';


import  helmet from 'helmet';
import 'reflect-metadata';


import './database/connection';
import routes from './routes';
import errorHandler from './errors/handler';

const app = express();

app.use(cors());  //acesso a todos frontends
app.use(helmet());
app.use(express.json());
app.use(routes);
app.use('/uploads/imgUpload', express.static(path.join(__dirname, '..', 'uploads/imgUpload')));
app.use('/uploads/vidUpload', express.static(path.join(__dirname, '..', 'uploads/vidUpload')));
app.use(errorHandler);


// app.listen(process.env.PORT || 3333) 
// console.log("Servidor rodando!")

const PORT = process.env.PORT || 3333 //Fall back to port 5000 if process.env.PORT is not set

app.listen(PORT, () => console.log(`Server listening on ${ PORT }`))