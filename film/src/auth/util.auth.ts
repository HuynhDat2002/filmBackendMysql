'use strict'

import * as jwt from 'jsonwebtoken'
import { CreateTokenPairProps } from "@/types"
import asyncHandler from '@/helpers/asyncHandler.helper'
import { Response, NextFunction } from 'express'
import { CustomRequest,CustomRequestUser } from '@/types'
import { errorResponse } from '@/cores'
import { PayloadTokenPair } from '@/types'
import { movieService } from '@/services'
import {createClient} from 'redis'


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
    console.log('access111',accessToken)
    console.log('public1111',publicKey)
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

    const client = createClient({url:"redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938"})
    await client.connect()
    const keyTokenAdmin = JSON.parse(await client.get('keyTokenAdmin') as string)
    console.log(`keyTokenAdmin`,keyTokenAdmin)
    //2. check key store
    if (userId!==keyTokenAdmin.user) throw new errorResponse.NotFound("Không tin thấy user trong keystore")
    // console.log('key token',keyToken)

    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    console.log('access',accessToken)
    console.log('publicKey',keyTokenAdmin.publicKey)
    if (!accessToken) throw new errorResponse.AuthFailureError(`Access Token không hợp lệ`)
    try {
        let decodeUser: PayloadTokenPair | string |undefined
         jwt.verify(accessToken, keyTokenAdmin.publicKey,(err:any, decode:any) => {
                if (err) {
                    console.log(`Error verify: `, err)
                    throw new errorResponse.AuthFailureError('Bạn cần phải đăng nhập trước')
                }
                else {
                    decodeUser = decode
                    console.log(`Decode verify authentication: `, decode)
                }
            })
        console.log(`decode ${decodeUser}`)

        if (typeof decodeUser === 'object') {
            if (userId !== decodeUser.userId) throw new errorResponse.AuthFailureError(`Không thể  giải mã access token`)
            req.keyTokenAdmin = keyTokenAdmin
            req.admin = decodeUser
            return next()
        }
    }
    catch (e) {
        throw e
    }


})


export const authentication = asyncHandler(async (req: CustomRequestUser, res: Response, next: NextFunction) => {
    //1.check userId missing
    const userId: string = req.headers[HEADER.CLIENT_ID] as string
    if (!userId) throw new errorResponse.AuthFailureError("Bạn cần phải đăng nhập trước.")
        const client = createClient({url:"redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938"})

    await client.connect()
    const keyToken = JSON.parse(await client.get('keyTokenUser') as string)
    console.log(`keyTokenUser`,keyToken)
    //2. check key store
    if (userId!==keyToken.user) throw new errorResponse.NotFound("không tìm thấy  user trong key store")
    // console.log('key token',keyToken)

    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    console.log('access',accessToken)
    console.log('publicKey',keyToken.publicKey)
    if (!accessToken) throw new errorResponse.AuthFailureError(`Access token không hợp lệ`)
    try {
        let decodeUser: PayloadTokenPair | string |undefined
            jwt.verify(accessToken, keyToken.publicKey,(err:any, decode:any) => {
                if (err) {
                    console.log(`Error verify: `, err)
                    throw new errorResponse.AuthFailureError('Bạn cần phải đăng nhập trước')
                }
                else {
                    decodeUser = decode
                    console.log(`Decode verify authentication: `, decode)
                }
            })
            
        console.log(`decode ${decodeUser}`)

        if (typeof decodeUser === 'object') {
            if (userId !== decodeUser.userId) throw new errorResponse.AuthFailureError(`Không thể giải mã access token`)
            req.keyToken = keyToken
            const userInfo = JSON.parse(await client.get('user') as string)
            req.user = userInfo
            return next()
        }
    }
    catch (e) {
        throw e
    }


})
// export const authentication = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
//     //1.check userId missing
//     const userId: string = req.headers[HEADER.CLIENT_ID] as string
//     if (!userId) throw new errorResponse.AuthFailureError("Invalid request! User not found.")
    
//     //2. check key store
//     const keyToken = await keyTokenModel.findOne({ user: userId })
//     if (!keyToken) throw new errorResponse.NotFound("Not found user in key store.")
//     // console.log('key token',keyToken)

//     //3. verify token
//     const accessToken = req.headers[HEADER.AUTHORIZATION] as string
//     console.log('access',accessToken)
//     console.log('publicKey',keyToken.publicKey)
//     if (!accessToken) throw new errorResponse.AuthFailureError(`Invalid accessToken`)
//     try {
//         let decodeUser: PayloadTokenPair | string |undefined
//          jwt.verify(accessToken, keyToken.publicKey,(err, decode) => {
//                 if (err) {
//                     console.log(`Error verify: `, err)
//                 }
//                 else {
//                     decodeUser = decode
//                     console.log(`Decode verify: `, decode)
//                 }
//             })
//         console.log(`decode ${decodeUser}`)

//         if (typeof decodeUser === 'object') {
//             if (userId !== decodeUser.userId) throw new errorResponse.AuthFailureError(`Invalid decode request`)
//             // req.keyToken = keyToken
//             req.user = decodeUser
//             return next()
//         }
//     }
//     catch (e) {
//         throw e
//     }


// })