'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { movieController } from '@/controllers'
import { authenticationAdmin } from '@/auth/util.auth'
const movieRouter = express.Router()

movieRouter.get('/getMovie/:id',asyncHandler(movieController.getMovie))
movieRouter.get('/getAllMovie',asyncHandler(movieController.getAllMovie))

movieRouter.use(authenticationAdmin)
movieRouter.post('/createMovie',asyncHandler(movieController.createMovie))
movieRouter.put('/updateMovie',asyncHandler(movieController.updateMovie))
movieRouter.delete('/deleteMovie/:id',asyncHandler(movieController.deleteMovie))




export default movieRouter