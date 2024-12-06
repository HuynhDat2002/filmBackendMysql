'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { movieController } from '@/controllers'
import { authenticationAdmin,authentication } from '@/auth/util.auth'
import { checkPermission } from '@/auth/check.permission'
const movieRouter = express.Router()

movieRouter.get('/getMovie/:id',asyncHandler(movieController.getMovie))
movieRouter.get('/getAllMovie',asyncHandler(movieController.getAllMovie))
movieRouter.get('/getRatings/:id',asyncHandler(movieController.getRatings))
movieRouter.get('/getPageTotal',asyncHandler(movieController.getPageTotal))
movieRouter.patch('/ratingMovie',authentication,checkPermission("readAny","film"),asyncHandler(movieController.ratingMovie))


movieRouter.use(authentication)
movieRouter.post('/createMovie',checkPermission("createAny","film"),asyncHandler(movieController.createMovie))
// movieRouter.put('/updateMovie',asyncHandler(movieController.updateMovie))
movieRouter.delete('/deleteMovie/:id',checkPermission("deleteAny","film"),asyncHandler(movieController.deleteMovie))


export default movieRouter