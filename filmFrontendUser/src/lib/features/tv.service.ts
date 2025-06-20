// import {  updateAxiosUserInstanceFilm } from '../../utils/axiosConfig';

// export const getAllTV = async (page:number) => {
//     try {
//         console.log('get al tv')
//         let axios =await updateAxiosUserInstanceFilm()
//         const response = await axios.get(`/tv/getAllTV?page=${page}`);
//         console.log(response.data)
//         return response.data;

//     }
//     catch (error: any) {
//         throw error?.response?.data ? error.response.data : error
//     }
// }

// export const search = async (data: { query: string, page: string }) => {
//     try {
//         let axios =await updateAxiosUserInstanceFilm()

//         const response = await axios.get(`/tv/getAllTV?query=${data.query}&page=${data.page}`);
//         console.log(response.data)
//         return response.data;
//     }
//     catch (error: any) {
//         throw error.response.data ? error.response.data : error
//     }
// }

// export const getA = async (data: {id:string}) => {
//     try {
//         console.log('tv get a',data)
//         let axios =await updateAxiosUserInstanceFilm()

//         const response = await axios.get(`/tv/getTV/${data.id}`);
//         console.log(response.data)
//         return response.data;
//     }
//     catch (error: any) {
//         throw error.response.data ? error.response.data : error
//     }
// }



// export const ratingTV = async (data:{filmId:string,rating:number})=>{
//     try{
//         let axios =await updateAxiosUserInstanceFilm()

//         const response = await axios.patch(`/tv/ratingTV`,{filmId:data.filmId,rating:data.rating});
//         console.log(response.data)
//         return response.data;
//     }
//     catch (error:any){
//         throw error.response.data ? error.response.data : error
//     }
// }

// export const getRatings = async (data:{filmId:string})=>{
//     try{
//         let axios =await updateAxiosUserInstanceFilm()

//         const response = await axios.get(`/tv/getRatings/${data.filmId}`);
//         console.log(response.data)
//         return response.data;
//     }
//     catch (error:any){
//         throw error.response.data ? error.response.data : error
//     }
// }

// export const getPageTotal = async ()=>{
//     try{
//         let axios =await updateAxiosUserInstanceFilm()

//         const response = await axios.get(`/tv/getPageTotal`);
//         console.log(response.data)
//         return response.data;
//     }
//     catch (error:any){
//         throw error.response.data ? error.response.data : error
//     }
// }