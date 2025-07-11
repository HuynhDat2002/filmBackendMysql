'use strict'

import { adminModel } from '@/models/access.model'
import { Request, Response, NextFunction } from 'express'
import { SignUpProps, SignInProps, TokenPairProps, CheckDevice } from '@/types'
import { errorResponse } from '@/cores'
import bcrypt from 'bcryptjs'
import crypto, { Sign } from 'crypto'
import { createTokenPair } from '@/auth/util.auth'
import { getInfoData, publishMessage, createChannel } from '@/utils'
import { KeyTokenModelProps, Captcha } from '@/types'
import * as messageConfig from '@/configs/messageBroker.config'
import * as regex from '@/middlewares/regex'
import { PayloadTokenPair } from "@/types"
import { prisma } from '@/db/prisma.init'
import { Role } from '@prisma/client';
import * as otpService from './otp.service'
import amqplib from 'amqplib'
import {clientRedis} from '@/utils'
import axios from 'axios'
export const signUp = async ({ name, email, password, role = "ADMIN" }: SignUpProps) => {
    //check input
    console.log("hello signup")
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidName = await name.match(regex.nameRegex)
    if (isValidName === null) throw new errorResponse.BadRequestError('Tên không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ! Mật khẩu phải có ít nhất 1 chữ hoa, một ký tự đặc biệt và có độ dài từ 8-32 ký tự')
    console.log('hello check signup',email)
    // check if user exist
    const userFound = await prisma.user.findUnique({ where: { email: email } });
    console.log('userfound',userFound)
    if (userFound) {
        console.log('user',userFound)
        throw new errorResponse.BadRequestError("Tài khoản đã tồn tại");
        // return {
        //     code: "xxx",
        //     message: "This shop already registered!",
        // };
    }
    console.log('before')
    //hash password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('after')
    //create new user
    console.log('new user')

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash,
            role: role as Role
        }
    });
    console.log('new user2')
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
            userId: newUser.id.toString(),
            email: email
        },
        publicKey,
        privateKey
    })

    // create key token to store publickey,privatekey,refreshtoken
    const keyToken = await prisma.keyTokens.create({
        data: {
            userId: newUser.id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        }
    })

    if (!keyToken) throw new errorResponse.BadRequestError(`Không thể  tạo key token`)
        console.log('create')
    return {
        user: getInfoData(["id", "name", "email"], newUser),
        tokens
    }
}

export const checkDevice = async ({ email, password, userAgent }: CheckDevice) => {
    //check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ!')

    // check if user exist
    console.log('typeof email', typeof email)
    const userFound = await prisma.user.findUnique({ where: { email: email }, include: { userAgent: true } })
    if (!userFound) throw new errorResponse.AuthFailureError(`Tài khoản không tồn tại`)

    //compare password
    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) throw new errorResponse.AuthFailureError(`Mật khẩu không trùng khớp`)

    // check device

    const userAgents = userFound.userAgent.map((ua:{userId:string,agentId:string}) => ua.agentId);
    const getUserAgentId = await prisma.userAgent.findFirst({ where: { agent: userAgent } })
    if (!userAgents.includes(getUserAgentId?.id as string)) {
        await otpService.sendOTPVerifyEmail({ email })
        console.log('sent', email)
        throw new errorResponse.BadRequestError('Ban dang dang nhap tren thiet bi moi, hay nhap ma OTP!')
    }

    return {
        user: getInfoData(["id", 'name'], userFound)
    }
}

export const verifyTokenCaptcha = async (token: string) => {
    const secretKey = process.env.CAPTCHA_SECRET_KEY
    console.log('secerkey', secretKey)
    console.log('token12', token)
    if (!secretKey) throw new errorResponse.AuthFailureError('Not secret key found')
    const url = new URL("https://www.google.com/recaptcha/api/siteverify")
    url.searchParams.append('secret', secretKey);
    url.searchParams.append('response', token)

    const res = await axios.post(url.toString())

    if (!res) return null
    console.log('res', res)
    const captchaData: Captcha = await res.data
    console.log('captcha', captchaData)
    if (!captchaData) {
        return {
            success: false,
            message: "Captcha Failed"
        }
    }
    if (!captchaData.success || captchaData.score < 0.5) {
        return {
            success: false,
            message: "Captcha Failed",
            errors: !captchaData.success ? captchaData["error-codes"] : null,
        }
    }
    return {
        success: true,
        message: "Captcha Successfully"
    }
}
export const signIn = async ({ email, password, userAgent, tokenCaptcha }: SignInProps) => {
    //check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ!')

    //captcha
    // const captcha = await verifyTokenCaptcha(tokenCaptcha)
    // console.log('captcha',captcha)
    // if(!captcha) throw new errorResponse.AuthFailureError('Ban chua xac minh captcha')
    // if(captcha.success===false) throw new errorResponse.AuthFailureError(`${captcha.message}`)


    // check if user exist
    const userFound = await prisma.user.findUnique({ where: { email: email }, include: { userAgent: true } })
    if (!userFound) throw new errorResponse.AuthFailureError(`Tài khoản không tồn tại`)

    //check how many times login error
    if (userFound.timeLock && userFound.timeLock as Date >= new Date()) throw new errorResponse.AuthFailureError(`Tai khoan cua ban da bi khoa trong vong 1p. Hay thu lai sau!`)

    //compare password
    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) {
        let failedTimes = await userFound.failedLogin
        let lockUntil = await userFound.timeLock as Date
        failedTimes += 1
        if (failedTimes > 4) {
            await prisma.user.update({
                where: {
                    id: userFound.id
                },
                data: {
                    failedLogin: 0,
                    timeLock: new Date(Date.now() + 60 * 1000)
                }
            })
            await otpService.notifyAccountLocked({ email: userFound.email })
            throw new errorResponse.AuthFailureError(`Tai khoan cua ban da bi khoa trong vong 1p. Hay thu lai sau!`)

        }
        await prisma.user.update({
            where: {
                id: userFound.id
            },
            data: {
                failedLogin: failedTimes,
            }
        })
        throw new errorResponse.AuthFailureError(`Mật khẩu không trùng khớp. Ban con ${5 - failedTimes} lan thu`)
    }
    await prisma.user.update({
        where: {
            id: userFound.id
        },
        data: {
            failedLogin: 0,
            timeLock: null
        }
    })
    //check device
    // const userAgents = userFound.userAgent.map((ua: any) => ua.agentId);
    // console.log('userAgents', userAgents)
    // let getUserAgentId = await prisma.userAgent.findFirst({ where: { agent: userAgent } })
    // console.log('getuseragentid', getUserAgentId)
    // if (!getUserAgentId) getUserAgentId = { id: "", agent: "" }
    // if (!userAgents.includes(getUserAgentId.id as string)) {
    //     //check verify
    //     const checkVerified = await prisma.oTP.findUnique({ where: { email: email } })
    //     if (!checkVerified) throw new errorResponse.BadRequestError('Bạn đang đăng nhập trên thiết bị mới, hãy xác minh bằng email trước')
    //     if (!checkVerified.verified) throw new errorResponse.BadRequestError('Bạn đang đăng nhập trên thiết bị mới, hãy xác minh bằng email trước')
    //     const expires = checkVerified.expiresAt as any
    //     if (expires < Date.now()) throw new errorResponse.BadRequestError(`OTP đã hết hạn`)
    //     const newAgent = await prisma.userOnAgent.create({
    //         data: {
    //             userAgent: {
    //                 connectOrCreate: {
    //                     where: {
    //                         agent: userAgent
    //                     },
    //                     create: {
    //                         agent: userAgent
    //                     }
    //                 }
    //             },
    //             user: {
    //                 connect: {
    //                     id: userFound.id as string
    //                 }
    //             }
    //         }
    //     })
    //     console.log('newAgent', newAgent)
    //     if (newAgent) await prisma.oTP.delete({ where: { email: email } })
    // }
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
            userId: userFound.id.toString(),
            email,
            role: userFound.role.toString()
        },
        publicKey,
        privateKey
    })

    // create key token to store publickey,privatekey,refreshtoken
    const keyToken = await prisma.keyTokens.upsert({
        where: { userId: userFound.id },
        create: {
            userId: userFound.id,
            publicKey: publicKey,
            privateKey: privateKey,
            refreshToken: tokens.refreshToken
        },
        update: {
            publicKey: publicKey,
            privateKey: privateKey,
            refreshToken: tokens.refreshToken
        }
    })
    if (!keyToken) throw new errorResponse.BadRequestError(`Không thể  tạo key token`)
        const agent = await prisma.userOnAgent.findMany({
            where: {
                userId: userFound.id
            },
            include: { userAgent: true }
        })
    // publish message to movie server
    const data = {
        event: "GET_USER_PAYLOAD",
        data: {
            userFound: userFound,
            keyToken: keyToken,
            agent: agent
        }
    }

    const channel = await createChannel() as amqplib.Channel
    await publishMessage(channel, messageConfig.FILM_BINDING_KEY, JSON.stringify(data))
    return {
        user: getInfoData(["id", "name", "email","role"], userFound),
        tokens
    }


}

export const logout = async (keyToken: KeyTokenModelProps) => {
    //delete key in keytoken
    const delKey = await prisma.keyTokens.delete({ where: { id: keyToken.id as string } })
    if (!delKey) throw new errorResponse.BadRequestError(`Không thể  xóa key token`)
    return delKey
}

export const getPayloadAdmin = async (adminId: string) => {
    //check input
    const isValidId = await adminId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')

    //check if user exist
    const adminFound = await prisma.user.findUnique({ where: { id: adminId } })

    //check if keytoken exist
    const keyToken = await prisma.keyTokens.findUnique({ where: { userId: adminId } })

    //publish message to movie server
    const data = {
        event: "GET_ADMIN_PAYLOAD",
        data: {
            adminFound: adminFound,
            keyToken: keyToken
        }
    }
    const channel = await createChannel()  as amqplib.Channel
    publishMessage(channel, messageConfig.FILM_BINDING_KEY, JSON.stringify(data))
    return data;
}

export const getUser = async ({ userId }: { userId: string }) => {
    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')

    //get user
    const userFound = await prisma.user.findUnique({ where: { id: userId } })
    if (!userFound) throw new errorResponse.BadRequestError(`Người dùng không tồn tại`)
    return {
        user: getInfoData(["id", "name", "email"], userFound)
    }
}

export const editUser = async ({ userId, payload }: { userId: string, payload: { name: string } }) => {
    //check input
    const isValidId = await userId.match(regex.idRegex)
    if (isValidId === null) throw new errorResponse.BadRequestError('Id không hợp lệ')

    const isValidName = await payload.name.match(regex.nameRegex)
    if (isValidName === null) throw new errorResponse.BadRequestError('Tên không hợp lệ')


    //find user
    const userFound = await prisma.user.findUnique({ where: { id: userId } })
    if (!userFound) throw new errorResponse.BadRequestError(`Người dùng không tồn tại`)

    //edit user
    const result = await prisma.user.update({ where: { id: userId }, data: payload })
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
    const userFound = await prisma.user.findUnique({ where: { id: user.userId } })
    if (!userFound) throw new errorResponse.BadRequestError(`Bạn chưa xác thực tài khoản! Hãy đăng nhập trước.`)

    //check password match
    const checkPassword = await bcrypt.compare(password, userFound.password)
    if (!checkPassword) throw new errorResponse.AuthFailureError(`Mật khẩu bạn nhập không đúng`)

    //hash password
    const hashNewPassword = await bcrypt.hash(newPassword, 10)
    // change password
    return await prisma.user.update({ where: { id: user.userId }, data: { password: hashNewPassword } })
}

export const forgotPassword = async ({ email }: { email: string }) => {
    // check input
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')

    //find user
    const foundUser = await prisma.user.findUnique({ where: { email: email } })
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
    const checkVerified = await prisma.oTP.findUnique({ where: { email: email } })
    if (!checkVerified) throw new errorResponse.BadRequestError(`Bạn chưa được gửi mã otp`)
    if (!checkVerified.verified) throw new Error('Bạn cần phải xác nhận email trước')

    //hash password
    const hashNewPassword = await bcrypt.hash(newPassword, 10)

    //reset password
    const result = await prisma.user.update({ where: { email: email }, data: { password: hashNewPassword } })
    if (result) await prisma.oTP.delete({ where: { email: email } })
    return result
}

export const getUserList = async ()=>{
    const data = {
        event: "GET_USER_LIST",
    }
    const client =await clientRedis()
    await client.connect()
    await client.del("userList");

    const channel = await createChannel()  as amqplib.Channel
    await publishMessage(channel, "USER_BINDING", JSON.stringify(data))
    // let userList:Array<any> = JSON.parse(await client.get('userList') as string)
    const pollForResult = async () => {
        const start = Date.now();
        while (Date.now() - start < 5000) {
            const result = await client.get("userList");
            if (result) {
                return JSON.parse(result);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for `interval` ms
        }
        throw new Error("Timeout waiting for RBAC result from Redis");
    };
    
   const userList = await pollForResult()
    console.log('listuser',userList)
    const result  = userList?.map((user:any)=>({
        id:user.id,
        name:user.name,
        email:user.email,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
        status:user.status,
        failedLogin: user.failedLogin,
        timeLock:user.timeLock,
        
    }))
    return result
}

export const deleteUser = async ({userId}:{userId:string})=>{
    console.log('useriddd',userId)
    const data = {
        event: "DELETE_USER",
        data:{
            userId:userId
        }
    }
    const client = await clientRedis()
    await client.connect()
    await client.del("userDel");

    const channel = await createChannel()  as amqplib.Channel
    await publishMessage(channel, "USER_BINDING", JSON.stringify(data))

    const pollForResult = async () => {
        const start = Date.now();
        while (Date.now() - start < 5000) {
            const result = await client.get("userDel");
            if (result) {
                return JSON.parse(result);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for `interval` ms
        }
        throw new Error("Timeout waiting for RBAC result from Redis");
    };


    // let userDel = JSON.parse(await client.get('userDel') as string)
    // setTimeout(async () =>{
    //     if(userDel){
    //         await client.del('userDel')
    //     }
    // },2000)
    // if(userDel===null){
    //     userDel = JSON.parse(await client.get('userDel') as string)
    // }

    const userDel =await pollForResult()
    return userDel
}