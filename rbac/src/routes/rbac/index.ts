'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { rbacController } from '@/controllers'
const rbacRouter = express.Router()

rbacRouter.post('/role', asyncHandler(rbacController.newRole))
rbacRouter.post('/grant', asyncHandler(rbacController.newGrant))

rbacRouter.get('/roles', asyncHandler(rbacController.listRoles))
rbacRouter.post('/resource', asyncHandler(rbacController.newResource))
rbacRouter.get('/resources', asyncHandler(rbacController.listResources))


export default rbacRouter