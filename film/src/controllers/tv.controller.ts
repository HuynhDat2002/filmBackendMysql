'use strict'

import {Request,Response,NextFunction} from 'express'
import { successResponse } from '@/cores'
import { tvService } from '@/services'
import { CustomRequest, KeyTokenModelProps } from '@/types'
import { resolve } from 'path/win32'

export const createTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.Created({
        message:"Added a new tv",
        metadata: await tvService.createTV(req.body)
    }).send(res)
}

export const updateTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.SuccessResonse({
        message:"Updated a tv",
        metadata: await tvService.updateTV(req.body)
    }).send(res)
}


export const deleteTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const movieId = req.params.id
    new successResponse.SuccessResonse({
        message:"Deleted a tv",
        metadata: await tvService.deleteTV(movieId)
    }).send(res)
}

export const getTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const movieId = req.params.id
    new successResponse.SuccessResonse({
        message:"Got a tv",
        metadata: await tvService.getTV(movieId)
    }).send(res)
}

export const getAllTV = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const query = {
        query:req.query.query as string,
        page:req.query?.page as string
    }
    console.log(query);
    new successResponse.SuccessResonse({
        message:"Got all tv",
        metadata: await tvService.getAllTV(query)
    }).send(res)
}





