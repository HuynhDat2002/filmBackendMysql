'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { accessController } from '@/controllers'
import { authentication } from '@/auth/util.auth'
import { checkLogin } from '@/auth/util.auth'
import { checkPermission } from '@/auth/check.permission'
import { profileController } from '@/controllers'
const accessRouter = express.Router()

accessRouter.post('/checkLogin',checkLogin)
accessRouter.post('/signUp',authentication,checkPermission("createAny","admin"),asyncHandler(accessController.signUp))
accessRouter.post('/signIn',asyncHandler(accessController.signIn))
// accessRouter.get('/profile',checkPermission('readOwn',"user","user"),asyncHandler(profileController.profile))
accessRouter.use(authentication)

accessRouter.get('/getPayloadAdmin',checkPermission("readOwn","admin"),asyncHandler(accessController.getPayloadAdmin))
accessRouter.get('/getUser',checkPermission("readOwn","admin"),asyncHandler(accessController.getUser))
accessRouter.post('/logout',checkPermission("readOwn","admin"),asyncHandler(accessController.logOut))
accessRouter.patch('/changePassword',checkPermission("updateOwn","admin"),asyncHandler(accessController.changePassword))
accessRouter.patch('/editUser',checkPermission("updateOwn","admin"),asyncHandler(accessController.editUser))

export default accessRouter 


/**
 * Thieu xoa user
 * them update user
 */