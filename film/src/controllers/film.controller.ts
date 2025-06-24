'use strict'

import {Request,Response,NextFunction} from 'express'
import { successResponse } from '@/cores'
import { filmService } from '@/services'
import { CustomRequest,CustomRequestUser, KeyTokenModelProps,QueryProps } from '@/types'

export const createFilm = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.Created({
        message:"Added a new movie",
        metadata: await filmService.createFilm(req.body)
    }).send(res)
}

export const filter = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const { field,data,page} = req.query
    new successResponse.Created({
        message:"Got a filter list",
        metadata: await filmService.filterFilm({field:field as string,data: data as string,page:parseInt(page as string)})
    }).send(res)
}

export const updateFilm = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.SuccessResonse({
        message:"Updated a movie",
        metadata: await filmService.updateFilm(req.body)
    }).send(res)
}


export const deleteFilm = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const movieId = req.params.id
    console.log('movieId',movieId);
    new successResponse.SuccessResonse({
        message:"Deleted a movie",
        metadata: await filmService.deleteFilm(movieId)
    }).send(res)
}

export const getFilm = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const movieId = req.params.id
    console.log('movieId',movieId);

    new successResponse.SuccessResonse({
        message:"Got a movie",
        metadata: await filmService.getFilm(movieId)
    }).send(res)
}

export const getAllFilm = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const query = {
        query:req.query.query as string||"",
        page:req.query?.page ? parseInt(req.query.page as string) : 1,
    }
    console.log(query);
    new successResponse.SuccessResonse({
        message:"Got all movie",
        metadata: await filmService.getAllFilm(query)
    }).send(res)
}

export const ratingFilm = async (req:CustomRequestUser,res:Response,next:NextFunction)=>{
    const userId = req?.user?.id as string || ""

    new successResponse.SuccessResonse({
        message:"Rated film successfully",
        metadata: await filmService.ratingFilm({filmId:req.body.filmId,userId:userId,rating:req.body.rating})
    }).send(res)
}


export const getRatings = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const filmId = req.params.id as string ||""
    new successResponse.SuccessResonse({
        message:"Got all ratings",
        metadata: await filmService.getRatingByFilm({filmId:filmId})
    }).send(res)
}

export const getPageTotal = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.SuccessResonse({
        message:"Got lenght",
        metadata: await filmService.getPageTotal()
    }).send(res)
}

export const getListCategory = async (req:CustomRequest,res:Response,next:NextFunction)=>{
  
    new successResponse.SuccessResonse({
        message:"Got list of category",
        metadata: await filmService.getListCategory()
    }).send(res)
}

export const getListCountry = async (req:CustomRequest,res:Response,next:NextFunction)=>{
  
    new successResponse.SuccessResonse({
        message:"Got list of country",
        metadata: await filmService.getListCountry()
    }).send(res)
}


export const deleteAllFilm = async (req:CustomRequest,res:Response,next:NextFunction)=>{
  
    new successResponse.SuccessResonse({
        message:"All films deleted",
        metadata: await filmService.deleteFilms()
    }).send(res)
}








