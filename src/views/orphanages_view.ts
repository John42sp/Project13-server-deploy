import Orphanage from '../models/Orphanage';
import imagesView from '../views/images_view';
import videosView from '../views/videos_view';


export default {
    render(orphanage: Orphanage){
        return {
            id: orphanage.id,
            name: orphanage.name,
            latitude: Number(orphanage.latitude),
            longitude: Number(orphanage.longitude),
            about: orphanage.about,
            instructions: orphanage.instructions,
            opening_hours: orphanage.opening_hours,
            open_on_weekends: orphanage.open_on_weekends,
            images: imagesView.renderMany(orphanage.images),
            videos: videosView.renderMany(orphanage.videos),
            user_name: orphanage.user_name,
            user_id: orphanage.user_id
        }
    },
  //no renderMany, percorrendo todos ofanatos, e pra cada um deles estou chamando metodo render logo acima
    renderMany(orphanages: Orphanage[]){
        return orphanages.map(orphanage => this.render(orphanage))
    }

}