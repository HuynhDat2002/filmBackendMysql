'use strict'

import crypto, { Sign } from 'crypto'

import * as jwt from 'jsonwebtoken'
import { CreateTokenPairProps } from "@/types"
import asyncHandler from '@/helpers/asyncHandler.helper'
import { Response, NextFunction } from 'express'
import { CustomRequest } from '@/types'
import { errorResponse } from '@/cores'
import { PayloadTokenPair } from '@/types'
import * as regex from '@/middlewares/regex'
import { prisma } from '@/db/prisma.init'
const HEADER = {
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'refreshtoken',
    AUTHORIZATION: 'authorization'
}

export const createTokenPair = async ({ payload, publicKey, privateKey }: CreateTokenPairProps) => {
    // in ra payload truoc khi su dung jwt de so sanh
    console.log(`payload`, payload)
    const accessToken: string = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: "1d"
    })

    const refreshToken: string = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: "7d"
    })
    // in ra accessToken để kiểm tra
    console.log(`accessToken login:`,accessToken)
    jwt.verify(accessToken, publicKey, (err, decode) => {
        if (err) {
            console.log(`Error verify login: `, err)
        }
        else {
            console.log(`Decode verify login: `, decode)
        }
    })
    return { accessToken, refreshToken }
}


// export const authentication = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
//     //1.check userId missing
//     console.log(req.headers)
//     const userId: string = req.headers[HEADER.CLIENT_ID] as string

//     if (!userId) throw new errorResponse.AuthFailureError("Không tìm thấy userId")

//     //check header
//     const isValidId = userId.match(regex.idRegex)
//     if (isValidId === null) throw new errorResponse.AuthFailureError(`Định dạng Id không đúng`)

//      // check if user exist
//      const userFound = await prisma.user.findUnique({where:{id:userId},include:{userAgent:true}})
//     if(!userFound) throw new errorResponse.BadRequestError('User Id không tồn tại')
//     const userAgents = userFound.userAgent.map(ua=>ua.agentId)
//     const getAgentId = await prisma.userAgent.findFirst({where:{agent:req.headers["user-agent"] as string}})
//     if(!userAgents.includes(getAgentId?.id as string)) throw new errorResponse.BadRequestError(`Ban dang dang nhap tren thiet bi moi`)
    
//     //2. check key store
//     const keyToken = await prisma.keyTokens.findUnique({where:{ userId: userId }})
//     if (!keyToken) throw new errorResponse.NotFound("Không tìm thấy user trong keyToken")
//     // console.log('key token',keyToken)

//     //3. verify token
//     const accessToken = req.headers[HEADER.AUTHORIZATION] as string
//     console.log('access', accessToken)
//     console.log('publicKey', keyToken.publicKey)
//     if (!accessToken) throw new errorResponse.AuthFailureError(`Bạn cần phải đăng nhập trước`)

//     //check header
//     const isValidAccess = accessToken.match(regex.accessRegex)
//     if (isValidAccess === null) throw new errorResponse.AuthFailureError(`Định dạng token không đúng`)

//     jwt.verify(accessToken, keyToken.publicKey, (err: any, decode: any) => {
//         if (err) {
//             console.log(`Error verify: `, err)
//             throw new errorResponse.AuthFailureError(`Bạn cần phải đăng nhập trước`)

//         }
//         else {
//             console.log(`Decode verify: `, decode)
//             if (userId !== decode.userId) throw new errorResponse.AuthFailureError(`Invalid decode request`)
//             req.keyToken = keyToken
//             req.user = decode
//             return next()
//         }
//     })

// })

// export const checkLogin = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
//     //1.check userId missing
//     const userId: string = req.headers[HEADER.CLIENT_ID] as string
//     if (!userId) throw new errorResponse.AuthFailureError("Unauthorized")

//     //check header userId
//     const isValidId = userId.match(regex.idRegex)
//     if (isValidId === null) throw new errorResponse.AuthFailureError(`Invalid Format Id`)

//     // check if user exist
//     const userFound = await prisma.user.findUnique({where:{id:userId},include:{userAgent:true}})
//     if(!userFound) throw new errorResponse.BadRequestError('Not Found User')

//     //2. check key store
//     const keyToken = await prisma.keyTokens.findUnique({where:{ userId: userId }})
//     if (!keyToken) throw new errorResponse.NotFound("Unauthorized")
//     // console.log('key token',keyToken)

//     //3. verify token
//     const accessToken = req.headers[HEADER.AUTHORIZATION] as string
//     console.log('access', accessToken)
//     console.log('publicKey', keyToken.publicKey)

//     if (!accessToken) throw new errorResponse.AuthFailureError(`Bạn cần phải đăng nhập trước`)

//     //check header access token
//     const isValidAccess = accessToken.match(regex.accessRegex)
//     if (isValidAccess === null) throw new errorResponse.AuthFailureError(`Định dạng token không đúng`)


//     jwt.verify(accessToken, keyToken.publicKey, (err: any, decode: any) => {
//         if (err) {
//             console.log(`Error verify: `, err)
//             throw new errorResponse.AuthFailureError(`Bạn cần phải đăng nhập trước`)
//         }
//         else {
//             console.log(`Decode verify: `, decode)
//             if (userId !== decode.userId) throw new errorResponse.AuthFailureError(`Không tìm thấy user`)
//             req.keyToken = keyToken
//             req.user = decode
//         }
//     })


//     return res.status(200).json({ message: `Authorized` })

// })