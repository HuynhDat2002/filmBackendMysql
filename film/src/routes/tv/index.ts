'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { tvController } from '@/controllers'
import { authenticationAdmin ,authentication} from '@/auth/util.auth'
const tvRouter = express.Router()

tvRouter.get('/getTV/:id',asyncHandler(tvController.getTV))
tvRouter.get('/getAllTV',asyncHandler(tvController.getAllTV))
tvRouter.get('/getRatings/:id',asyncHandler(tvController.getRatings))

tvRouter.patch('/ratingTV',authentication,asyncHandler(tvController.ratingTV))

tvRouter.use(authenticationAdmin)
tvRouter.post('/createTV',asyncHandler(tvController.createTV))
tvRouter.put('/updateTV',asyncHandler(tvController.updateTV))
tvRouter.delete('/deleteTV/:id',asyncHandler(tvController.deleteTV))




export default tvRouter