import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.API_KEY as string,
    api_secret: process.env.SECRET_KEY as string,

});


export const uploadImages = async (url: string, name = "", retries = 5) => {

    try {
        console.log('url image', url)
        console.log('upload')
        const image = await cloudinary.uploader.upload(url, { timeout: 60000, public_id: name, folder: `film/images` })

        console.log('image', image)
        if (image) {
            return image.url
        }
        return ""
    }
    catch (err: any) {
        console.log('err upload', err)
        // Retry nếu là timeout error
       
        return ""
       
    }
}



