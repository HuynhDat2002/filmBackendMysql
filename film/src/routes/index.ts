'use strict'

import express from 'express'
import movieRouter from './movie'
import tvRouter from './tv'
import commentRouter from './comment'

const router = express.Router()

router.use('/api/movie',movieRouter)
router.use('/api/tv',tvRouter)
router.use('/api/comment',commentRouter)



export default router