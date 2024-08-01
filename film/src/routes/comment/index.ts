'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { commentController } from '@/controllers'
import { authenticationAdmin,authentication } from '@/auth/util.auth'

const commentRouter = express.Router()


commentRouter.get('/getAllCommentByFilm/:id',asyncHandler(commentController.getAllCommentByFilm))

commentRouter.post('/getCommentByParentId',asyncHandler(commentController.getCommentByParentId))
commentRouter.post('/createComment',authentication,asyncHandler(commentController.createComment))
commentRouter.delete('/deleteComment',authentication,asyncHandler(commentController.deleteComment))
commentRouter.patch('/editComment',authentication,asyncHandler(commentController.editComment))

commentRouter.post('/createCommentAdmin',authenticationAdmin,asyncHandler(commentController.createCommentAdmin))
commentRouter.delete('/deleteCommentAdmin',authenticationAdmin,asyncHandler(commentController.deleteCommentAdmin))
commentRouter.patch('/editCommentAdmin',authenticationAdmin,asyncHandler(commentController.editCommentAdmin))









export default commentRouter