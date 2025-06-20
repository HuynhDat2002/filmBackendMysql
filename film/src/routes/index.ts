'use strict'

import express from 'express'
import filmRouter from './film'
// import tvRouter from './tv'
import commentRouter from './comment'

const router = express.Router()

router.use('/api',filmRouter)
// router.use('/api/tv',tvRouter)
router.use('/api/comment',commentRouter)



export default router