import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.SECRET_KEY as string,
});


export const uploadImages = async (url:string,name="") => {


    try{

        const image = await cloudinary.uploader.upload(url,{public_id:name,folder: `film/images`})
        console.log('image',image)
        if(image){
    
            return image
        }
        return {
            url:""
        }
    }
    catch (err){
        return {
            url:""
        }
    }
}



