'use strict'

import express from 'express'
import accessRouter from './access'
const router = express.Router()

router.use('/api/user',accessRouter)

export default router