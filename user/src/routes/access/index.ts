'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { accessController } from '@/controllers'
import { authentication, checkLogin } from '@/auth/util.auth'
import { otpService } from '@/services'
import { checkPermission } from '@/auth/check.permission'
const accessRouter = express.Router()


accessRouter.post('/checkLogin',checkLogin)
accessRouter.post('/checkDevice',asyncHandler(accessController.checkDevice))
accessRouter.post('/signUp',asyncHandler(accessController.signUp))
accessRouter.post('/signIn',asyncHandler(accessController.signIn))
accessRouter.post('/forgotPassword',asyncHandler(accessController.forgotPassword))
accessRouter.post('/verifyOTP',asyncHandler(accessController.verifyOTP))
accessRouter.post('/resetPassword',asyncHandler(accessController.resetPassword))
accessRouter.post('/sendOTP',asyncHandler(accessController.sendOTP))


accessRouter.use(authentication)
accessRouter.post('/logout',asyncHandler(accessController.logOut))
accessRouter.post('/changePassword',checkPermission('updateOwn','user'),asyncHandler(accessController.changePassword))
accessRouter.get('/getUser',checkPermission('readOwn','user'),asyncHandler(accessController.getUser))
accessRouter.patch('/editUser',checkPermission('updateOwn','user'),asyncHandler(accessController.editUser))
accessRouter.patch('/editAgent',checkPermission('updateOwn','user'),asyncHandler(accessController.editAgent))



export default accessRouter