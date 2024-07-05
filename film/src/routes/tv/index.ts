'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { tvController } from '@/controllers'
import { authenticationAdmin } from '@/auth/util.auth'
const tvRouter = express.Router()

tvRouter.get('/getTV/:id',asyncHandler(tvController.getTV))
tvRouter.get('/getAllTV',asyncHandler(tvController.getAllTV))

tvRouter.use(authenticationAdmin)
tvRouter.post('/createTV',asyncHandler(tvController.createTV))
tvRouter.put('/updateTV',asyncHandler(tvController.updateTV))
tvRouter.delete('/deleteTV/:id',asyncHandler(tvController.deleteTV))




export default tvRouter