'use strict'

import express from 'express'
import movieRouter from './movie'
import tvRouter from './tv'

const router = express.Router()

router.use('/api/movie',movieRouter)
router.use('/api/tv',tvRouter)


export default router