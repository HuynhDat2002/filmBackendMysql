import { base_url ,updateAxiosUserInstanceFilm} from '../../utils/axiosConfig';
let axios = updateAxiosUserInstanceFilm()
export const getMovies = async (page:number)=>{
    try{
        updateAxiosUserInstanceFilm()
        const response = await axios.get(`${base_url}/movie/getAllMovie?page=${page}`);
        return response.data;
    }
    catch (error:any){
        console.log('movie',error)
        throw error
    }
}

export const search = async (data:{query:string,page:string})=>{
    try{

        const response = await axios.get(`${base_url}/movie/getAllMovie?query=${data.query}&page=${data.page}`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error
    }
}

export const getA = async (data:{id:string})=>{
    try{

        const response = await axios.get(`/movie/getMovie/${data.id}`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error
    }
}

export const ratingMovie = async (data:{filmId:string,rating:number})=>{
    try{

        const response = await axios.patch(`/movie/ratingMovie`,{filmId:data.filmId,rating:data.rating});
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        console.log('error rating',error)
        throw error
    }
}

export const getRatings = async (data:{filmId:string})=>{
    try{
        updateAxiosUserInstanceFilm()

        const response = await axios.get(`/movie/getRatings/${data.filmId}`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error
    }
}

export const getPageTotal = async ()=>{
    try{
        updateAxiosUserInstanceFilm()

        const response = await axios.get(`/movie/getPageTotal`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error
    }
}

export const createMovie = async (data:{urlEmbed:string})=>{
    try{
        await updateAxiosUserInstanceFilm()
        const response = await axios.post(`/movie/createMovie`,data);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data
    }
}

export const deleteMovie = async (data:{id:string})=>{
    try{
        await updateAxiosUserInstanceFilm()
        const response = await axios.delete(`/movie/deleteMovie/${data.id}`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data
    }
}