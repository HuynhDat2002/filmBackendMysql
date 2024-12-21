import { updateAxiosUserInstanceFilm} from '../../utils/axiosConfig';

export const getMovies = async (page:number)=>{
    try{
        // updateAxiosUserInstanceFilm()
        console.log('movies service')
        let axios = await updateAxiosUserInstanceFilm()
        const response = await axios.get(`/movie/getAllMovie?page=${page}`);
        console.log('response movies', response.data)

        return response.data;
    }
    catch (error:any){
        console.log('errorrrr',  error)
        throw error
    }
}

export const search = async (data:{query:string,page:string})=>{
    try{
        let axios = await updateAxiosUserInstanceFilm()

        const response = await axios.get(`/movie/getAllMovie?query=${data.query}&page=${data.page}`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}

export const getA = async (data:{id:string})=>{
    try{
        let axios = await updateAxiosUserInstanceFilm()
       
        const response = await axios.get(`/movie/getMovie/${data.id}`);
        console.log('getmovie',response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}

export const ratingMovie = async (data:{filmId:string,rating:number})=>{
    try{
        let axios = await updateAxiosUserInstanceFilm()

        const response = await axios.patch(`/movie/ratingMovie`,{filmId:data.filmId,rating:data.rating});
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        console.log('error rating',error)
        throw error.response.data ? error.response.data : error
    }
}

export const getRatings = async (data:{filmId:string})=>{
    try{
        let axios = await updateAxiosUserInstanceFilm()

        const response = await axios.get(`/movie/getRatings/${data.filmId}`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}

export const getPageTotal = async ()=>{
    try{
        let axios = await updateAxiosUserInstanceFilm()



        const response = await axios.get(`/movie/getPageTotal`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}