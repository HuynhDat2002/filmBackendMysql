// 'use strict'

// import express from 'express'
// import asyncHandler from '@/helpers/asyncHandler.helper'
// import { tvController } from '@/controllers'
// import { authenticationAdmin ,authentication} from '@/auth/util.auth'
// import { checkPermission } from '@/auth/check.permission'
// const tvRouter = express.Router()

// tvRouter.get('/getTV/:id',asyncHandler(tvController.getTV))
// tvRouter.get('/getAllTV',asyncHandler(tvController.getAllTV))
// tvRouter.get('/getRatings/:id',asyncHandler(tvController.getRatings))
// tvRouter.get('/getPageTotal',asyncHandler(tvController.getPageTotal))

// tvRouter.patch('/ratingTV',authentication,checkPermission("readAny","film"),asyncHandler(tvController.ratingTV))

// tvRouter.use(authentication)
// tvRouter.post('/createTV',checkPermission("createAny","film"),asyncHandler(tvController.createTV))
// // tvRouter.put('/updateTV',asyncHandler(tvController.updateTV))
// // tvRouter.delete('/deleteTV/:id',asyncHandler(tvController.deleteTV))

// export default tvRouter