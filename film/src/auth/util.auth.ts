'use strict'

import * as jwt from 'jsonwebtoken'
import { CreateTokenPairProps } from "@/types"
import asyncHandler from '@/helpers/asyncHandler.helper'
import { Response, NextFunction } from 'express'
import { CustomRequest, CustomRequestUser } from '@/types'
import { errorResponse } from '@/cores'
import { PayloadTokenPair } from '@/types'
import { movieService } from '@/services'
import { createClient } from 'redis'
import * as regex from '@/middlewares/regex'
import { prisma } from '@/db/prisma.init'
const HEADER = {
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'refreshtoken',
    AUTHORIZATION: 'authorization'
}

export const createTokenPair = async ({ payload, publicKey, privateKey }: CreateTokenPairProps) => {
    const accessToken: string = jwt.sign(payload, publicKey, {
        expiresIn: "1d"
    })

    const refreshToken: string = jwt.sign(payload, privateKey, {
        expiresIn: "7d"
    })
    console.log('access111', accessToken)
    console.log('public1111', publicKey)
    // jwt.verify(accessToken, publicKey, (err, decode) => {
    //     if (err) {
    //         console.log(`Error verify: `, err)
    //     }
    //     else {
    //         console.log(`Decode verify: `, decode)
    //     }
    // })

    return { accessToken, refreshToken }
}


export const authenticationAdmin = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    //1.check userId missing
    const userId: string = req.headers[HEADER.CLIENT_ID] as string
    if (!userId) throw new errorResponse.AuthFailureError("Bạn cần phải đăng nhập trước")
    // await movieService.client.connect()

    //check userId
    const isValidId = userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.AuthFailureError(`Định dạng Id không đúng`)

    const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
    await client.connect()
    const keyTokenAdmin = JSON.parse(await client.get('keyTokenAdmin') as string)
    const userInfo = JSON.parse(await client.get('admin') as string)

    //2. check key store
    if (userId !== keyTokenAdmin.userId) throw new errorResponse.NotFound("Bạn cần phải đăng nhập trước")

    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    console.log('access', accessToken)
    console.log('publicKey', keyTokenAdmin.publicKey)

    if (!accessToken) throw new errorResponse.AuthFailureError(`Bạn cần phải đăng nhập trước`)

    //check header access token
    const isValidAccess = accessToken.match(regex.accessRegex)
    if (isValidAccess === null) throw new errorResponse.AuthFailureError(`Định dạng token không đúng`)

    jwt.verify(accessToken, keyTokenAdmin.publicKey, (err: any, decode: any) => {
        if (err) {
            console.log(`Error verify: `, err)
            throw new errorResponse.AuthFailureError(`Bạn cần phải đăng nhập trước`)
        }
        else {
            console.log(`Decode verify authentication: `, decode)
            if (userId !== decode.userId) throw new errorResponse.AuthFailureError(`Không thể  giải mã access token`)
            req.keyTokenAdmin = keyTokenAdmin
            req.admin = userInfo
            return next()
        }
    })
})


export const authentication = asyncHandler(async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    //1.check userId missing
    console.log('headers authentication', req.headers)

    const userId: string = req.headers[HEADER.CLIENT_ID] as string
    if (!userId) throw new errorResponse.AuthFailureError("Bạn cần phải đăng nhập trước.")
   
    const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
    await client.connect()
    // const keyToken = JSON.parse(await client.get('keyTokenUser') as string)
    // const userInfo = JSON.parse(await client.get('user') as string)
    // const agent = JSON.parse(await client.get('agent') as string)

    const userLogin  = await prisma.userLogin.findUnique({where:{userId:userId}})
    if(!userLogin) throw new errorResponse.AuthFailureError('Bạn cần phải đăng nhập trước')
    const keyToken = JSON.parse(userLogin.keyToken as string)
    const userInfo = JSON.parse(userLogin.user as string)
    const agent = JSON.parse(userLogin.agent as string)
    console.log(`keyTokenUser`, keyToken)
    console.log('userlogininfo',userInfo)
    console.log('agent',agent)

    const userAgents = agent.map((ua:any) => ua.userAgent.agent)
    if (!userAgents.includes(req.headers["user-agent"])) throw new errorResponse.BadRequestError(`Ban dang dang nhap tren thiet bi moi`)

    //2. check key store
    if (userId !== keyToken.userId) throw new errorResponse.NotFound("không tìm thấy  user trong key store")
    if (userId !== userInfo.id) throw new errorResponse.NotFound("Ban hay dang nhap truoc")

    //check userId
    const isValidId = userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.AuthFailureError(`Định dạng Id không đúng`)

    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    console.log('access', accessToken)
    console.log('publicKey', keyToken.publicKey)

    if (!accessToken) throw new errorResponse.AuthFailureError(`Bạn cần phải đăng nhập trước`)

    //check header access token
    const isValidAccess = accessToken.match(regex.accessRegex)
    if (isValidAccess === null) throw new errorResponse.AuthFailureError(`Định dạng token không đúng`)

    jwt.verify(accessToken, keyToken.publicKey, (err: any, decode: any) => {
        if (err) {
            console.log(`Error verify: `, err)
            throw new errorResponse.AuthFailureError(`Bạn cần phải đăng nhập trước`)

        }
        else {
            console.log(`Decode verify authentication: `, decode)
            if (userId !== decode.userId) throw new errorResponse.AuthFailureError(`Không thể giải mã access token`)
            req.keyToken = keyToken
            req.user = userInfo
            return next()
        }
    })
})