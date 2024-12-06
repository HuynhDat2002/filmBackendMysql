'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { commentController } from '@/controllers'
import { authenticationAdmin,authentication } from '@/auth/util.auth'
import { checkPermission } from '@/auth/check.permission'

const commentRouter = express.Router()


commentRouter.get('/getAllCommentByFilm/:id',asyncHandler(commentController.getAllCommentByFilm))
commentRouter.post('/getCommentByParentId',asyncHandler(commentController.getCommentByParentId))


commentRouter.post('/createComment',authentication,checkPermission("createOwn","comment"),asyncHandler(commentController.createComment))
commentRouter.delete('/deleteComment',authentication,checkPermission("deleteOwn","comment"),asyncHandler(commentController.deleteComment))
commentRouter.patch('/editComment',authentication,checkPermission("updateOwn","comment"),asyncHandler(commentController.editComment))

commentRouter.use(authenticationAdmin)

// commentRouter.post('/createCommentAdmin',authenticationAdmin,checkPermission("createAny","comment"),asyncHandler(commentController.createCommentAdmin))
commentRouter.delete('/deleteCommentAdmin',authenticationAdmin,checkPermission("deleteAny","comment"),asyncHandler(commentController.deleteCommentAdmin))
commentRouter.patch('/editCommentAdmin',authenticationAdmin,checkPermission("updateAny","comment"),asyncHandler(commentController.editCommentAdmin))


export default commentRouter