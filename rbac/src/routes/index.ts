'use strict'

import express from 'express'
import rbacRouter from './rbac'
const router = express.Router()

router.use('/api',rbacRouter)

export default router