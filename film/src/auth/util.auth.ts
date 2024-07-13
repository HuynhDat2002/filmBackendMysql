'use strict'

import * as jwt from 'jsonwebtoken'
import { CreateTokenPairProps } from "@/types"
import asyncHandler from '@/helpers/asyncHandler.helper'
import { Response, NextFunction } from 'express'
import { CustomRequest } from '@/types'
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
    if (!userId) throw new errorResponse.AuthFailureError("Invalid request! User not found.")
        // await movieService.client.connect()

    const client = createClient()
    await client.connect()
    const keyTokenAdmin = JSON.parse(await client.get('keyTokenAdmin') as string)
    console.log(`keyTokenAdmin`,keyTokenAdmin)
    //2. check key store
    if (userId!==keyTokenAdmin.user) throw new errorResponse.NotFound("Not found user in key store.")
    // console.log('key token',keyToken)

    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    console.log('access',accessToken)
    console.log('publicKey',keyTokenAdmin.publicKey)
    if (!accessToken) throw new errorResponse.AuthFailureError(`Invalid accessToken`)
    try {
        let decodeUser: PayloadTokenPair | string |undefined
         jwt.verify(accessToken, keyTokenAdmin.publicKey,(err:any, decode:any) => {
                if (err) {
                    console.log(`Error verify: `, err)
                }
                else {
                    decodeUser = decode
                    console.log(`Decode verify: `, decode)
                }
            })
        console.log(`decode ${decodeUser}`)

        if (typeof decodeUser === 'object') {
            if (userId !== decodeUser.userId) throw new errorResponse.AuthFailureError(`Invalid decode request`)
            req.keyTokenAdmin = keyTokenAdmin
            req.admin = decodeUser
            return next()
        }
    }
    catch (e) {
        throw e
    }


})


export const authentication = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    //1.check userId missing
    const userId: string = req.headers[HEADER.CLIENT_ID] as string
    if (!userId) throw new errorResponse.AuthFailureError("Bạn cần phải đăng nhập trước.")

    const client = createClient()
    await client.connect()
    const keyToken = JSON.parse(await client.get('keyTokenUser') as string)
    console.log(`keyTokenAdmin`,keyToken)
    //2. check key store
    if (userId!==keyToken.user) throw new errorResponse.NotFound("Not found user in key store.")
    // console.log('key token',keyToken)

    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    console.log('access',accessToken)
    console.log('publicKey',keyToken.publicKey)
    if (!accessToken) throw new errorResponse.AuthFailureError(`Invalid accessToken`)
    try {
        let decodeUser: PayloadTokenPair | string |undefined
         jwt.verify(accessToken, keyToken.publicKey,(err:any, decode:any) => {
                if (err) {
                    console.log(`Error verify: `, err)
                }
                else {
                    decodeUser = decode
                    console.log(`Decode verify: `, decode)
                }
            })
        console.log(`decode ${decodeUser}`)

        if (typeof decodeUser === 'object') {
            if (userId !== decodeUser.userId) throw new errorResponse.AuthFailureError(`Invalid decode request`)
            req.keyToken = keyToken
            req.user = decodeUser
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