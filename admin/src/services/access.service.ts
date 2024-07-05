'use strict'

import { adminModel } from '@/models/access.model'
import { Request, Response, NextFunction } from 'express'
import { SignUpProps, SignInProps, TokenPairProps } from '@/types'
import { errorResponse } from '@/cores'
import bcrypt from 'bcrypt'
import crypto, { Sign } from 'crypto'
import { createTokenPair } from '@/auth/util.auth'
import { keyTokenModel } from '@/models/keyToken.model'
import { getInfoData, publishMessage,createChannel } from '@/utils'
import { KeyTokenModelProps } from '@/types'
import { error } from 'console'
import * as messageConfig from '@/configs/messageBroker.config'

export const signUp = async ({ name, email, password }: SignUpProps) => {
    const userFound = await adminModel.findOne({ email }).lean();
    if (userFound) {
        throw new errorResponse.BadRequestError("User already registered");
        // return {
        //     code: "xxx",
        //     message: "This shop already registered!",
        // };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await adminModel.create({
        name,
        email,
        password: passwordHash,
        role: "USER",
    });

    if (!newUser) throw new errorResponse.BadRequestError(`Cannot create new user`)


    const publicKey: string = crypto.randomBytes(64).toString("hex");
    const privateKey: string = crypto.randomBytes(64).toString("hex");


    // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    //     modulusLength: 4096,
    //     publicKeyEncoding: { type: 'spki', format: 'pem' },
    //     privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    // })



    const tokens: TokenPairProps = await createTokenPair({
        payload: {
            userId: newUser._id.toString(),
            email: email
        },
        publicKey,
        privateKey
    })

    const keyToken = await keyTokenModel.create({
        user: newUser._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
    })

    if (!keyToken) throw new errorResponse.BadRequestError(`Cannot create keyToken`)
    return {
        user: getInfoData(["_id", "name", "email"], newUser),
        tokens
    }
}


export const signIn = async ({ email, password }: SignInProps) => {
    const userFound = await adminModel.findOne({ email: email })
    if (!userFound) throw new errorResponse.AuthFailureError(`User not found`)

    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) throw new errorResponse.AuthFailureError(`Password not match`)

    const publicKey: string = crypto.randomBytes(64).toString("hex");
    const privateKey: string = crypto.randomBytes(64).toString("hex");

    const tokens: TokenPairProps = await createTokenPair({
        payload: {
            userId: userFound._id.toString(),
            email
        },
        publicKey,
        privateKey
    })

    const keyToken = await keyTokenModel.findOneAndUpdate(
        { user: userFound._id },
        {
            user: userFound._id,
            publicKey: publicKey,
            privateKey: privateKey,
            refreshToken: tokens.refreshToken
        },
        {
            upsert: true,
            new: true
        }
    )
    if (!keyToken) throw new errorResponse.BadRequestError(`Cannot create key token`)
    const data = {
        event:"GET_ADMIN_PAYLOAD",
        data:{
            adminFound:userFound,
            keyToken:keyToken
        }
    }
    const channel = await createChannel()
    publishMessage(channel,messageConfig.FILM_BINDING_KEY,JSON.stringify(data))
    return {
        user: getInfoData(["_id", "name", "email"], userFound),
        tokens
    }

}


export const logout = async (keyToken: KeyTokenModelProps) => {
    const delKey = await keyTokenModel.deleteOne({ _id: keyToken._id })
    return delKey
}

export const getPayloadAdmin = async (adminId:string)=>{
    const adminFound = await adminModel.findOne({_id:adminId})
    const keyToken  = await keyTokenModel.findOne({user:adminId})
    const data = {
        event:"GET_ADMIN_PAYLOAD",
        data:{
            adminFound:adminFound,
            keyToken:keyToken
        }
    }
    const channel = await createChannel()
    publishMessage(channel,messageConfig.FILM_BINDING_KEY,JSON.stringify(data))
    return data;
}