import { base_url ,updateAxiosUserInstanceFilm} from '../../utils/axiosConfig';
import { AxiosRequestConfig } from 'axios'
let axios = updateAxiosUserInstanceFilm()

export const getCommentByFilm = async (data:{filmId:string})=>{
    try{
       await updateAxiosUserInstanceFilm()
        const response = await axios.get(`${base_url}/comment/getAllCommentByFilm/${data.filmId}`);
        console.log('get comments by film')
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}

export const getCommentByParentId = async (data:{filmId:string,parentCommentId:string})=>{
    try{
       await updateAxiosUserInstanceFilm()
        const response = await axios.post(`${base_url}/comment/getCommentByParentId`,{filmId:data.filmId,parentCommentId:data.parentCommentId});
        console.log('get comments by parent',response.data)
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}

export const createComment = async (data:{filmId:string,content:string,parentCommentId?:string})=>{
    try{
        await updateAxiosUserInstanceFilm()
        console.log('data comment',data)
        const response = await axios.post(`${base_url}/comment/createCommentAdmin`,data);
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}


export const editComment = async (data:{commentId:string,filmId:string,content:string})=>{
    try{
        await updateAxiosUserInstanceFilm()
        const response = await axios.patch(`${base_url}/comment/editCommentAdmin`,data);
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}


export const deleteComment = async (data:{commentId:string,filmId:string})=>{

    try{
        await updateAxiosUserInstanceFilm()
       
        const response = await axios.delete(`${base_url}/comment/deleteCommentAdmin?commentId=${data.commentId}&filmId=${data.filmId}`);
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}




