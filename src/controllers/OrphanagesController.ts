
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';
import User from '../models/User';


export default {
    async index(req: Request, res: Response){
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images', 'user', 'videos'] 
        });
        return res.json(orphanageView.renderMany(orphanages));
    },

    async show(req: Request, res: Response){
        const id = req.params;
        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images', 'user', 'videos']
        });
        return res.json(orphanageView.render(orphanage));
    },

    async create(req: Request, res: Response){
      const { user_id, user_name } = req.headers;      

        const { 
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
           } = req.body
          
          const orphanageRepository = getRepository(Orphanage);
   
  
        const { images, videos } = req.files as { [fieldname: string]: Express.Multer.File[] }; 

           
        // const images = requestImages.map(image => ({ path: image.filename }));
        // const videos = requestVideos.map(video => ({ path: video.filename }));


          const imagesArr =  images.map((image:Express.Multer.File) => {
              return { path: image.filename}
          });

          const videosArr = videos.map((video:Express.Multer.File) => {
            return { path: video.filename}
        })

        
          const data = {       
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === "true",
            images: imagesArr,
            videos: videosArr,
            user_name,
            user_id, 
          } as {};
        

          const schema = Yup.object().shape({
              name: Yup.string().required().min(4).max(25),
              latitude: Yup.number().required(),
              longitude: Yup.number().required(),
              about: Yup.string().required().max(300),
              instructions: Yup.string().required(),
              opening_hours: Yup.string().required(),
              open_on_weekends: Yup.boolean().required(),
              images: Yup.array(Yup.object().shape({
                  path: Yup.string().required()
              })),
              videos: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            })),
              
          })

          await schema.validate(data, {
              abortEarly: false
          });
          const orphanage = orphanageRepository.create(data)
          await orphanageRepository.save(orphanage); 
          
            // return res.status(201).json(orphanage); 
            return res.status(201).send(`Orphanage ${orphanage.name} created successfully.`); 

    },

    async delete(req: Request, res: Response) {
                  //Get the ID from the url
                  const id = req.params.id;

                  const orphanageRepository = getRepository(Orphanage);
                  console.log(orphanageRepository)

                //   const userOwner = await userRepository.findOne({where: { user_id }});
                  let orphanage;
                  try {
               
                      orphanage = await orphanageRepository.findOneOrFail(id);   
                      console.log(orphanage)

                      orphanageRepository.delete(orphanage);        
          
                      res.status(200).send(`Orphanage ${orphanage} deleted successfuly`);       

                  } catch (error) {
                      res.status(404).send("Orphanage not found");
                      return;
                  }
                 
    }
}