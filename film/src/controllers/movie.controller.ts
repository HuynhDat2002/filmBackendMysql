'use strict'

import {Request,Response,NextFunction} from 'express'
import { successResponse } from '@/cores'
import { movieService } from '@/services'
import { CustomRequest, KeyTokenModelProps,QueryProps } from '@/types'
import { resolve } from 'path/win32'

export const createMovie = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.Created({
        message:"Added a new movie",
        metadata: await movieService.createMovie(req.body)
    }).send(res)
}

export const updateMovie = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.SuccessResonse({
        message:"Updated a movie",
        metadata: await movieService.updateMovie(req.body)
    }).send(res)
}


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





