'use strict'

import { Request, Response, NextFunction } from 'express'
import { successResponse } from '@/cores'
import { commentService } from '@/services'
import { CustomRequest, CustomRequestUser, UserProps, KeyTokenModelProps, QueryProps } from '@/types'

export const createComment = async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    const user  = req?.user  as UserProps

    new successResponse.Created({
        message: "Added a new comment",
        metadata: await commentService.createComment({
            filmId: req.body.filmId, user: user, content: req.body.content, parentCommentId: req.body?.parentCommentId
        })
    }).send(res)
}


// export const createCommentAdmin = async (req: CustomRequestUser, res: Response, next: NextFunction) => {
//     const user = req?.admin as UserProps
//     new successResponse.Created({
//         message: "Added a new comment",
//         metadata: await commentService.createComment({ filmId: req.body.filmId, user: user, content: req.body.content, parentCommentId: req.body?.parentCommentId })
//     }).send(res)
// }
 export const getCommentByParentId = async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    const userId = req?.user?.id as string
    console.log('body parent', req.body)
    new successResponse.Created({
        message: "Get all comments by parentId",
        metadata: await commentService.getCommentByParentId({ filmId: req.body.filmId, parentCommentId: req.body?.parentCommentId })
    }).send(res)
}

export const deleteComment = async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    const userId = req?.user?.id as string
    const user = req.user
    const query = {
        commentId: req.query?.commentId as string,
        filmId: req.query?.filmId as string
    }
    new successResponse.Created({
        message: "Deleted comment",
        metadata: await commentService.deleteComment({ userId: userId, user:user,commentId: query.commentId, filmId: query.filmId })
    }).send(res)
}

export const editComment = async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    const userId = req?.user?.id as string

    new successResponse.Created({
        message: "Updated Comment",
        metadata: await commentService.editComment({ userId: userId, commentId: req.body.commentId, filmId: req.body.filmId, content: req.body.content })
    }).send(res)
}


export const deleteCommentAdmin = async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    const userId = req?.user?.id as string
    const query = {
        commentId: req.query.commentId as string,
        filmId: req.query?.filmId as string
    }
    new successResponse.Created({
        message: "Deleted comment",
        // metadata: await commentService.deleteComment({ userId: userId, commentId: query.commentId, filmId: query.filmId })
    }).send(res)
}

export const editCommentAdmin = async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    const userId = req?.admin?.id as string
    
    new successResponse.Created({
        message: "Updated Comment",
        metadata: await commentService.editComment({ userId: userId, commentId: req.body.commentId, filmId: req.body.filmId, content: req.body.content })
    }).send(res)
}

export const getAllCommentByFilm = async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    const filmId = req?.params?.id as string
    new successResponse.Created({
        message: "Get all comments by film",
        metadata: await commentService.getAllCommentByFilm({ filmId: filmId })
    }).send(res)
}









