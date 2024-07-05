'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { accessController } from '@/controllers'
import { authentication } from '@/auth/util.auth'
const accessRouter = express.Router()

accessRouter.post('/signUp',asyncHandler(accessController.signUp))
accessRouter.post('/signIn',asyncHandler(accessController.signIn))


accessRouter.use(authentication)

accessRouter.get('/getPayloadAdmin/',asyncHandler(accessController.getPayloadAdmin))
accessRouter.post('/logout',asyncHandler(accessController.logOut))


export default accessRouter