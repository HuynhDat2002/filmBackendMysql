'use strict'

import { adminModel } from '@/models/access.model'
import { Request, Response, NextFunction } from 'express'
import { SignUpProps, SignInProps, TokenPairProps } from '@/types'
import { errorResponse } from '@/cores'
import bcrypt from 'bcrypt'
import crypto, { Sign } from 'crypto'
import { createTokenPair } from '@/auth/util.auth'
import { keyTokenModel } from '@/models/keyToken.model'
import { getInfoData, publishMessage, createChannel } from '@/utils'
import { KeyTokenModelProps } from '@/types'
import * as messageConfig from '@/configs/messageBroker.config'
import * as regex from '@/middlewares/regex'
import {PayloadTokenPair} from "@/types"
export const signUp = async ({ name, email, password }: SignUpProps) => {
    //check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidName = await name.match(regex.nameRegex)
    if (isValidName === null) throw new errorResponse.BadRequestError('Tên không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ! Mật khẩu phải có ít nhất 1 chữ hoa, một ký tự đặc biệt và có độ dài từ 8-32 ký tự')

    // check if user exist
    const userFound = await adminModel.findOne({ email }).lean();
    if (userFound) {
        throw new errorResponse.BadRequestError("Tài khoản đã tồn tại");
        // return {
        //     code: "xxx",
        //     message: "This shop already registered!",
        // };
    }
    //hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //create new user
    const newUser = await adminModel.create({
        name,
        email,
        password: passwordHash,
        role: "ADMIN",
    });

    if (!newUser) throw new errorResponse.BadRequestError(`Không thể tạo tài khoản mớ`)

    //create publickey and privatekey for accesstoken and refreshtoken
    // const publicKey: string = crypto.randomBytes(64).toString("hex");
    // const privateKey: string = crypto.randomBytes(64).toString("hex");
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: {
            type: 'pkcs8', format: 'pem'
        },
    });



    //create tokens
    const tokens: TokenPairProps = await createTokenPair({
        payload: {
            userId: newUser._id.toString(),
            email: email
        },
        publicKey,
        privateKey
    })

    // create key token to store publickey,privatekey,refreshtoken
    const keyToken = await keyTokenModel.create({
        user: newUser._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
    })

    if (!keyToken) throw new errorResponse.BadRequestError(`Không thể  tạo key token`)
    return {
        user: getInfoData(["_id", "name", "email"], newUser),
        tokens
    }
}


export const signIn = async ({ email, password }: SignInProps) => {
    //check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ!')

    // check if user exist
    const userFound = await adminModel.findOne({ email: email })
    if (!userFound) throw new errorResponse.AuthFailureError(`Tài khoản không tồn tại`)

    //compare password
    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) throw new errorResponse.AuthFailureError(`Mật khẩu không trùng khớp`)

    //create publickey and privatekey for accesstoken and refreshtoken
    // const publicKey: string = crypto.randomBytes(64).toString("hex");
    // const privateKey: string = crypto.randomBytes(64).toString("hex");
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: {
            type: 'pkcs8', format: 'pem'
        },
    });
    //create tokens
    const tokens: TokenPairProps = await createTokenPair({
        payload: {
            userId: userFound._id.toString(),
            email
        },
        publicKey,
        privateKey
    })

    // create key token to store publickey,privatekey,refreshtoken
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
    if (!keyToken) throw new errorResponse.BadRequestError(`Không thể  tạo key token`)

    // publish message to movie server
    const data = {
        event: "GET_ADMIN_PAYLOAD",
        data: {
            adminFound: userFound,
            keyToken: keyToken
        }
    }
    const channel = await createChannel()
    await publishMessage(channel, messageConfig.FILM_BINDING_KEY, JSON.stringify(data))
    return {
        user: getInfoData(["_id", "name", "email"], userFound),
        tokens
    }

}


export const logout = async (keyToken: KeyTokenModelProps) => {
    //delete key in keytoken
    const delKey = await keyTokenModel.deleteOne({ _id: keyToken._id })
    if (!delKey) throw new errorResponse.BadRequestError(`Không thể  xóa key token`)
    return delKey
}

export const getPayloadAdmin = async (adminId: string) => {
    //check input
    const isValidId = await adminId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')

    //check if user exist
    const adminFound = await adminModel.findOne({ _id: adminId })

    //check if keytoken exist
    const keyToken = await keyTokenModel.findOne({ user: adminId })

    //publish message to movie server
    const data = {
        event: "GET_ADMIN_PAYLOAD",
        data: {
            adminFound: adminFound,
            keyToken: keyToken
        }
    }
    const channel = await createChannel()
    publishMessage(channel, messageConfig.FILM_BINDING_KEY, JSON.stringify(data))
    return data;
}

export const getUser = async ({ userId }: { userId: string }) => {
    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')

    //get user
    const userFound = await adminModel.findOne({ _id: userId })
    if (!userFound) throw new errorResponse.BadRequestError(`Người dùng không tồn tại`)
    return {
        user: getInfoData(["_id", "name", "email"], userFound)
    }
}

export const editUser = async ({ userId, payload }: { userId: string, payload: { name: string } }) => {
    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')

    const isValidName = await payload.name.match(regex.nameRegex)
    if (isValidName === null) throw new errorResponse.BadRequestError('Tên không hợp lệ')


    //find user
    const userFound = await adminModel.findOne({ _id: userId })
    if (!userFound) throw new errorResponse.BadRequestError(`Người dùng không tồn tại`)

    //edit user
    const result = await adminModel.findOneAndUpdate({ _id: userId }, { payload }, { new: true })
    if (!result) throw new errorResponse.BadRequestError(`Bạn không thể  cập nhật!`)
    return result
}

export const changePassword = async ({ user, password, newPassword }: { user: PayloadTokenPair, password: string, newPassword: string }) => {
    //check input
    const id = user.userId as string
    const isValidId = await id.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ!')

    const isValidNewPassword = await newPassword.match(regex.passwordRegex)
    if (isValidNewPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ!')

    //find user
    const userFound = await adminModel.findOne({ _id: user.userId })
    if (!userFound) throw new errorResponse.BadRequestError(`Bạn chưa xác thực tài khoản! Hãy đăng nhập trước.`)

    //check password match
    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) throw new errorResponse.AuthFailureError(`Mật khẩu bạn nhập không đúng`)

    // change password
    return await adminModel.findOneAndUpdate({ _id: user.userId }, { password: newPassword }, { new: true })
}