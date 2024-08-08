'use strict'

import { userModel } from '@/models/access.model'
import { Request, Response, NextFunction } from 'express'
import { SignUpProps, SignInProps, TokenPairProps, PayloadTokenPair } from '@/types'
import { errorResponse } from '@/cores'
import bcrypt from 'bcrypt'
import crypto, { Sign } from 'crypto'
import { createTokenPair } from '@/auth/util.auth'
import { keyTokenModel } from '@/models/keyToken.model'
import { getInfoData } from '@/utils'
import { KeyTokenModelProps } from '@/types'
import { otpModel } from '@/models/otp.model'
import { createClient } from 'redis'
import { createChannel, publishMessage } from '@/utils'
import * as messageConfig from '@/configs/messageBroker.config'
import * as regex from '@/middlewares/regex'
import { otpService } from '.'
type dataSign = {
    name: string, email: string, password: string
}
export const signUp = async () => {
    // get data from redis
    const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
    await client.connect()
    const data: dataSign = JSON.parse(await client.get('userSign') as string) ? JSON.parse(await client.get('userSign') as string) : { name: "", email: "", password: "" }
    const { name, email, password } = data

    //check regex
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidName = await name.match(regex.nameRegex)
    if (isValidName === null) throw new errorResponse.BadRequestError('Tên không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ! Mật khẩu phải có ít nhất 1 chữ hoa, một ký tự đặc biệt và có độ dài từ 8-32 ký tự')

    // check if user exist
    const userFound = await userModel.findOne({ email }).lean();
    if (userFound) throw new errorResponse.BadRequestError("Tài khoản đã tồn tại");


    //hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //create new user
    const newUser = await userModel.create({
        name,
        email,
        password: passwordHash,
        role: "USER",
    });

    if (!newUser) throw new errorResponse.BadRequestError(`Không thể tạo tài khoản mới`)

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

    // publish message to movie server
    const dataPayload = {
        event: "GET_USER_PAYLOAD",
        data: {
            userFound: newUser,
            keyToken: keyToken
        }
    }
    const channel = await createChannel()
    publishMessage(channel, messageConfig.FILM_BINDING_KEY, JSON.stringify(dataPayload))

    return {
        user: getInfoData(["_id"], newUser),
        tokens: tokens.accessToken
    }
}

export const checkDevice = async ({ email, password, userAgent }: SignInProps) => {
    //check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ!')

    // check if user exist
    console.log('typeof email', typeof email)
    const userFound = await userModel.findOne({ email: email})
    if (!userFound) throw new errorResponse.AuthFailureError(`Tài khoản không tồn tại`)

    //compare password
    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) throw new errorResponse.AuthFailureError(`Mật khẩu không trùng khớp`)

    //check device
    if (!userFound.userAgent.includes(userAgent)) {
        await otpService.sendOTPVerifyEmail({ email })
        console.log('sent', email)
        throw new errorResponse.BadRequestError('Bạn đang đăng nhập trên thiết bị mới, hãy xác minh bằng email trước')
    }
    return {
        user: getInfoData(["_id", 'name'], userFound)
    }
}

export const signIn = async ({ email, password, userAgent }: SignInProps) => {
    //check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ!')

    // check if user exist
    console.log('typeof email', typeof email)
    const userFound = await userModel.findOne({ email: email})
    if (!userFound) throw new errorResponse.AuthFailureError(`Tài khoản không tồn tại`)

    //compare password
    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) throw new errorResponse.AuthFailureError(`Mật khẩu không trùng khớp`)

    //check device
    if (!userFound.userAgent.includes(userAgent)) {
        //check verify
        const checkVerified = await otpModel.findOne({ email: email })
        if (!checkVerified) throw new errorResponse.BadRequestError('Bạn đang đăng nhập trên thiết bị mới, hãy xác minh bằng email trước')
        if (!checkVerified.verified) throw new errorResponse.BadRequestError('Bạn đang đăng nhập trên thiết bị mới, hãy xác minh bằng email trước')
        const expires = checkVerified.expiresAt as any
        if (expires < Date.now()) throw new Error(`OTP đã hết hạn`)
        await otpModel.findOneAndDelete({ email: email })
        await userFound.userAgent.push(userAgent)
        await userFound.save()
    }

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

    console.log('publicKeyyyyyy', publicKey)
    console.log('privateKeyyyyyy', privateKey)

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
        event: "GET_USER_PAYLOAD",
        data: {
            userFound: userFound,
            keyToken: keyToken
        }
    }
    const channel = await createChannel()
    await publishMessage(channel, messageConfig.FILM_BINDING_KEY, JSON.stringify(data))
    return {
        user: getInfoData(["_id"], userFound),
        tokens: tokens.accessToken
    }

}


export const logout = async (keyToken: KeyTokenModelProps) => {
    //delete key in keytoken
    const delKey = await keyTokenModel.deleteOne({ _id: keyToken._id })
    if (!delKey) throw new errorResponse.BadRequestError(`Không thể  xóa key token`)
    return delKey
}


export const forgotPassword = async ({ email }: { email: string }) => {
    // check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')

    //find user
    const foundUser = await userModel.findOne({ email: email })
    if (!foundUser) throw new Error(`Không tìm thấy tài khoản`)
    console.log('userrrr', foundUser)

    //send otp to email
    return await otpService.sendOTPVerifyEmail({ email })
}

export const resetPassword = async ({ email, newPassword }: { email: string, newPassword: string }) => {
    //check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')

    const isValidNewPassword = await newPassword.match(regex.passwordRegex)
    if (isValidNewPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ!')

    //check verify
    const checkVerified = await otpModel.findOne({ email: email })
    if (!checkVerified) throw new errorResponse.BadRequestError(`Bạn chưa được gửi mã otp`)
    if (!checkVerified.verified) throw new Error('Bạn cần phải xác nhận email trước')

    //hash password
    const hashNewPassword = await bcrypt.hash(newPassword, 10)

    //reset password
    const result = await userModel.findOneAndUpdate({ email: email }, { password: hashNewPassword }, { new: true })
    if (result) await otpModel.findOneAndDelete({ email: email })
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
    const userFound = await userModel.findOne({ _id: user.userId })
    if (!userFound) throw new errorResponse.BadRequestError(`Bạn chưa xác thực tài khoản! Hãy đăng nhập trước.`)

    //check password match
    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) throw new errorResponse.AuthFailureError(`Mật khẩu bạn nhập không đúng`)

    // change password
    return await userModel.findOneAndUpdate({ _id: user.userId }, { password: newPassword }, { new: true })
}


export const getUser = async ({ userId }: { userId: string }) => {
    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')

    //get user
    const userFound = await userModel.findOne({ _id: userId })
    if (!userFound) throw new errorResponse.BadRequestError(`Người dùng không tồn tại`)
    return {
        user: getInfoData(["_id", "name", "email"], userFound)
    }
}

export const editUser = async ({ userId, payload }: { userId: string, payload: any }) => {
    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')
    if (payload.name) {
        const isValidName = await payload.name.match(regex.nameRegex)
        if (isValidName === null) throw new errorResponse.BadRequestError('Tên không hợp lệ')
    }
    console.log('payload edit', payload)
    //find user
    const userFound = await userModel.findOne({ _id: userId })
    if (!userFound) throw new errorResponse.BadRequestError(`Người dùng không tồn tại`)

    //edit user
    const result = await userModel.findOneAndUpdate({ _id: userId }, { $set: payload }, { new: true })
    if (!result) throw new errorResponse.BadRequestError(`Bạn không thể  cập nhật!`)
    return result
}

