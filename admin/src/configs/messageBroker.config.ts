'use strict'

import 'dotenv/config'


export const APP_SECRET = process.env.APP_SECRET
export const USER_BINDING_KEY=process.env.USER_BINDING_KEY as string
export const FILM_BINDING_KEY = process.env.FILM_BINDING_KEY as string
export const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL as string
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME as string
export const QUEUE_NAME = process.env.QUEUE_NAME as string
export const RBAC_BINDING_KEY = process.env.RBAC_BINDING_KEY as string
