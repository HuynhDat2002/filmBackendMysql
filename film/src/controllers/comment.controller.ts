'use strict'

import {Request,Response,NextFunction} from 'express'
import { successResponse } from '@/cores'
import { commentService } from '@/services'
import { CustomRequest, CustomRequestUser,UserProps, KeyTokenModelProps,QueryProps } from '@/types'
import { resolve } from 'path/win32'

export const createComment = async (req:CustomRequestUser,res:Response,next:NextFunction)=>{
    const user  = req?.user  as UserProps
    
    new successResponse.Created({
        message:"Added a new comment",
        metadata: await commentService.createComment({filmId:req.body.filmId,user:user,content:req.body.content,parentCommentId:req.body?.parentCommentId})
    }).send(res)
}

export const getCommentByParentId = async (req:CustomRequestUser,res:Response,next:NextFunction)=>{
    const userId  = req?.user?._id as string
    
    new successResponse.Created({
        message:"Get all comments by parentId",
        metadata: await commentService.getCommentByParentId({filmId:req.body.filmId,parentCommentId:req.body?.parentCommentId})
    }).send(res)
}

export const deleteComment = async (req:CustomRequestUser,res:Response,next:NextFunction)=>{
    const userId  = req?.user?._id as string
    
    new successResponse.Created({
        message:"Get all comments by parentId",
        metadata: await commentService.deleteComment({userId:userId, commentId:req.body.commentId, filmId:req.body.filmId})
    }).send(res)
}


export const getAllCommentByFilm = async (req:CustomRequestUser,res:Response,next:NextFunction)=>{
    const filmId = req?.params?.id as string
    new successResponse.Created({
        message:"Get all comments by parentId",
        metadata: await commentService.getAllCommentByFilm({filmId:filmId})
    }).send(res)
}









