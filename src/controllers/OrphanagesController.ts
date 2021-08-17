
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';



export default {
    async index(req: Request, res: Response){
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images', 'user', 'videos'] //relations: indicadas no model, logo abaixo do @Joincolumn
        });
        // console.log(orphanageView.renderMany(orphanages))
        return res.json(orphanageView.renderMany(orphanages));
    },

    async show(req: Request, res: Response){
        const id = req.params;
        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images', 'user', 'videos']
        });
        // console.log(orphanage)
        return res.json(orphanageView.render(orphanage));
    },

    async create(req: Request, res: Response){
      const { user_id, user_name } = req.headers;      
   
      // const user_id = id;   

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
   
  
        const { images, videos } = req.files  as any;   

           
        // const images = requestImages.map(image => ({ path: image.filename }));
        // const videos = requestVideos.map(video => ({ path: video.filename }));


          const imagesArr =  images.map((image:any) => {
              return { path: image.filename}
          });

          const videosArr = videos.map((video:any) => {
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
          console.log(data)
        

          const schema = Yup.object().shape({
              name: Yup.string().required('Nome obrigatório.').min(4, 'Name must be at lease 4 digits.').max(25, 'Name no more than 25 digits please.'),
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
              // user_name: Yup.string().required(),
              // user_id: Yup.number().required()
          })

          await schema.validate(data, {
              abortEarly: false
          });
        //   console.log(data)
          const orphanage = orphanageRepository.create(data)
        //   console.log(orphanage)
          await orphanageRepository.save(orphanage); //salvando no banco
          
            return res.status(201).json(orphanage); //enviando pro frontend
    },

    async delete(req: Request, res: Response) {
                  //Get the ID from the url
                  const id = req.params.id;

                  const orphanageRepository = getRepository(Orphanage);
                  let orphanage;
                  try {
                      orphanage = await orphanageRepository.findOneOrFail(id);            
                  } catch (error) {
                      res.status(404).send("Orphanage not found");
                      return;
                  }
                  orphanageRepository.delete(orphanage);        
          
                  //After all send a 204 (no content, but accepted) response
                  res.status(200).send('Orphanage deleted successfuly');
    }
}