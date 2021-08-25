import Video from '../models/Videos';
export default {
    render(video: Video){
        return {
            id: video.id,                                   
            url: `${process.env.API_URL}/uploads/vidUpload/${video.path}`,
        }                                              
    },

    renderMany(videos: Video[]){
        return videos.map(video => this.render(video))
    }

}