'use strict'

import * as jwt from 'jsonwebtoken'
import { CreateTokenPairProps } from "@/types"
import asyncHandler from '@/helpers/asyncHandler.helper'
import { Response, NextFunction } from 'express'
import { CustomRequest } from '@/types'
import { errorResponse } from '@/cores'
import { keyTokenModel } from '@/models/keyToken.model'
import { PayloadTokenPair } from '@/types'
import * as regex from '@/middlewares/regex'
const HEADER = {
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'refreshtoken',
    AUTHORIZATION: 'authorization'
}

export const createTokenPair = async ({ payload, publicKey, privateKey }: CreateTokenPairProps) => {
    const accessToken: string = jwt.sign(payload, privateKey, {
        algorithm:"RS256",
        expiresIn: "1d"
    })

    const refreshToken: string = jwt.sign(payload, privateKey, {
        algorithm:"RS256",
        expiresIn: "7d"
    })

    jwt.verify(accessToken, publicKey, (err, decode) => {
        if (err) {
            console.log(`Error verify: `, err)
        }
        else {
            console.log(`Decode verify: `, decode)
        }
    })

    return { accessToken, refreshToken }
}


export const authentication = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    //1.check userId missing
    const userId: string = req.headers[HEADER.CLIENT_ID] as string
    //check header
    const isValidId = userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.AuthFailureError(`Định dạng Id không đúng`)
        
    if (!userId) throw new errorResponse.AuthFailureError("Invalid request! User not found.")

    //2. check key store
    const keyToken = await keyTokenModel.findOne({ user: userId })
    if (!keyToken) throw new errorResponse.NotFound("Not found user in key store.")
    // console.log('key token',keyToken)


    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    console.log('access', accessToken)
    console.log('publicKey', keyToken.publicKey)
    //check header
    const isValidAccess = accessToken.match(regex.accessRegex)
    if (isValidAccess === null) throw new errorResponse.AuthFailureError(`Định dạng token không đúng`)

    if (!accessToken) throw new errorResponse.AuthFailureError(`Invalid accessToken`)
    try {
        let decodeUser: PayloadTokenPair | string | undefined
        jwt.verify(accessToken, keyToken.publicKey, (err, decode) => {
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

export const checkLogin = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    //1.check userId missing
    const userId: string = req.headers[HEADER.CLIENT_ID] as string
    if (!userId) throw new errorResponse.AuthFailureError("Unauthorized")
       
        //check header userId
        console.log('admin idddd', userId)
    const isValidId = userId.match(regex.idRegex)
    if(isValidId===null) throw new errorResponse.AuthFailureError(`Định dạng Id không đúng`)

    //2. check key store
    const keyToken = await keyTokenModel.findOne({ user: userId })
    if (!keyToken) throw new errorResponse.NotFound("Unauthorized")
    // console.log('key token',keyToken)

    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    console.log('access', accessToken)
    console.log('publicKey', keyToken.publicKey)
    
     //check header access token
     const isValidAccess = accessToken.match(regex.accessRegex)
     if(isValidAccess===null) throw new errorResponse.AuthFailureError(`Định dạng token không đúng`)
   
    if (!accessToken) throw new errorResponse.AuthFailureError(`Unauthorized`)

    let decodeUser: PayloadTokenPair | string | undefined
    jwt.verify(accessToken, keyToken.publicKey, (err, decode) => {
        if (err) {
            console.log(`Error verify: `, err)
            throw new errorResponse.BadRequestError(`Unauthorized`)
        }
        else {
            decodeUser = decode
            console.log(`Decode verify: `, decode)
        }
    })
    console.log(`decode ${decodeUser}`)

    if (typeof decodeUser === 'object') {
        if (userId !== decodeUser.userId) throw new errorResponse.AuthFailureError(`Unauthorized`)
        req.keyToken = keyToken
        req.user = decodeUser
    }

    return res.status(200).json({message:`Authorized`})




})