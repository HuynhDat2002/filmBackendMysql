'use strict'

import {Request,Response,NextFunction} from 'express'
import { successResponse } from '@/cores'
import { movieService } from '@/services'
import { CustomRequest,CustomRequestUser, KeyTokenModelProps,QueryProps } from '@/types'
import { resolve } from 'path/win32'

export const createMovie = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.Created({
        message:"Added a new movie",
        metadata: await movieService.createMovie(req.body)
    }).send(res)
}

// export const updateMovie = async (req:CustomRequest,res:Response,next:NextFunction)=>{
//     new successResponse.SuccessResonse({
//         message:"Updated a movie",
//         metadata: await movieService.updateMovie(req.body)
//     }).send(res)
// }


export const deleteMovie = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const movieId = req.params.id
    new successResponse.SuccessResonse({
        message:"Deleted a movie",
        metadata: await movieService.deleteMovie(movieId)
    }).send(res)
}

export const getMovie = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const movieId = req.params.id
    new successResponse.SuccessResonse({
        message:"Got a movie",
        metadata: await movieService.getMovie(movieId)
    }).send(res)
}

export const getAllMovie = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const query = {
        query:req.query.query as string,
        page:req.query?.page as string
    }
    console.log(query);
    new successResponse.SuccessResonse({
        message:"Got all movie",
        metadata: await movieService.getAllMovie(query)
    }).send(res)
}

export const ratingMovie = async (req:CustomRequestUser,res:Response,next:NextFunction)=>{
    const userId = req?.user?.id as string || ""

    new successResponse.SuccessResonse({
        message:"Got all movie",
        metadata: await movieService.ratingMovie({filmId:req.body.filmId,userId:userId,rating:req.body.rating})
    }).send(res)
}


export const getRatings = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const filmId = req.params.id as string ||""
    new successResponse.SuccessResonse({
        message:"Got all ratings",
        metadata: await movieService.getRatings({filmId:filmId})
    }).send(res)
}

export const getPageTotal = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.SuccessResonse({
        message:"Got lenght",
        metadata: await movieService.getPageTotal()
    }).send(res)
}









