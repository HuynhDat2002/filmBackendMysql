'use strict'

import {Request,Response,NextFunction} from 'express'
import { successResponse } from '@/cores'
import { accessService } from '@/services'
import { CustomRequest, KeyTokenModelProps } from '@/types'
import { resolve } from 'path/win32'

export const signUp = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.Created({
        message:"Created a new user",
        metadata: await accessService.signUp(req.body)
    }).send(res)
}


export const signIn = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.SuccessResonse({
        message:"Login Successfully",
        metadata: await accessService.signIn(req.body)
    }).send(res)
}


export const logOut = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.SuccessResonse({
        message:"Logout Successfully",
        metadata: await accessService.logout(req.keyToken as KeyTokenModelProps)
    }).send(res)
}

export const getPayloadAdmin = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const adminId = req.user?.userId as string
    new successResponse.SuccessResonse({
        message:"Successfully",
        metadata: await accessService.getPayloadAdmin(adminId)
    }).send(res)
}