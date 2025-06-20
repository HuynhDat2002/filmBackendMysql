'use strict'

import express from 'express'
import asyncHandler from '@/helpers/asyncHandler.helper'
import { filmController } from '@/controllers'
import { authenticationAdmin,authentication } from '@/auth/util.auth'
import { checkPermission } from '@/auth/check.permission'
const filmRouter = express.Router()

filmRouter.get('/getFilm/:id',asyncHandler(filmController.getFilm))
filmRouter.get('/getAllFilm',asyncHandler(filmController.getAllFilm))
filmRouter.get('/getRatings/:id',asyncHandler(filmController.getRatings))
filmRouter.get('/getPageTotal',asyncHandler(filmController.getPageTotal))
filmRouter.patch('/ratingFilm',authentication,checkPermission("readAny","film"),asyncHandler(filmController.ratingFilm))
filmRouter.get('/getListCategory',asyncHandler(filmController.getListCategory))
filmRouter.get('/getListCountry',asyncHandler(filmController.getListCountry))
filmRouter.get('/filter',asyncHandler(filmController.filter))
filmRouter.use(authentication)
filmRouter.post('/createFilm',checkPermission("createAny","film"),asyncHandler(filmController.createFilm))
filmRouter.patch('/updateFilm',checkPermission("updateAny","film"),asyncHandler(filmController.updateFilm))
filmRouter.delete('/deleteFilm/:id',checkPermission("deleteAny","film"),asyncHandler(filmController.deleteFilm))
filmRouter.delete('/deleteAllFilm',checkPermission("deleteAny","film"),asyncHandler(filmController.deleteAllFilm))

export default filmRouter