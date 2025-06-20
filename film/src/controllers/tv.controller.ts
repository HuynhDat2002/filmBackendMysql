// 'use strict'

// import {Request,Response,NextFunction} from 'express'
// import { successResponse } from '@/cores'
// import { tvService } from '@/services'
// import { CustomRequest,CustomRequestUser, KeyTokenModelProps } from '@/types'
// import { resolve } from 'path/win32'

// export const createTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
//     new successResponse.Created({
//         message:"Added a new tv",
//         metadata: await tvService.createTV(req.body)
//     }).send(res)
// }

// // export const updateTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
// //     new successResponse.SuccessResonse({
// //         message:"Updated a tv",
// //         metadata: await tvService.updateTV(req.body)
// //     }).send(res)
// // }


// // export const deleteTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
// //     const movieId = req.params.id
// //     new successResponse.SuccessResonse({
// //         message:"Deleted a tv",
// //         metadata: await tvService.deleteTV(movieId)
// //     }).send(res)
// // }

// export const getTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
//     const movieId = req.params.id
//     new successResponse.SuccessResonse({
//         message:"Got a tv",
//         metadata: await tvService.getTV(movieId)
//     }).send(res)
// }

// export const getAllTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
//     const query = {
//          query:req.query.query as string||"",
//         page:req.query?.page ? parseInt(req.query.page as string) : 1,
//     }
//     console.log('querrytvvvvv',query);
//     new successResponse.SuccessResonse({
//         message:"Got all tv",
//         metadata: await tvService.getAllTV(query)
//     }).send(res)
// }

// export const ratingTV = async (req:CustomRequestUser,res:Response,next:NextFunction)=>{
//     const userId = req?.user?.id as string || ""
//     new successResponse.SuccessResonse({
//         message:"Got all movie",
//         metadata: await tvService.ratingTV({filmId:req.body.filmId,userId:userId,rating:req.body.rating})
//     }).send(res)
// }

// export const getRatings = async (req:CustomRequest,res:Response,next:NextFunction)=>{
//     const filmId = req.params.id as string ||""
    
//     new successResponse.SuccessResonse({
//         message:"Got all ratings",
//         metadata: await tvService.getRatings({filmId:filmId})
//     }).send(res)
// }

// export const getPageTotal = async (req:CustomRequest,res:Response,next:NextFunction)=>{
//     new successResponse.SuccessResonse({
//         message:"Got lenght",
//         metadata: await tvService.getPageTotal()
//     }).send(res)
// }


