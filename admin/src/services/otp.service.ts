'use strict'

import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import { VerifyOTPProps } from '@/types';
import { errorResponse } from '@/cores';
import { createClient } from 'redis'
import * as regex from '@/middlewares/regex'
import { prisma } from '@/db/prisma.init';
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 535,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "htldat2002@gmail.com",
        pass: "ifoaammmzukpfuev",
    },
});

export const sendOTPEmail = async (mailOption: any) => {
    return await transporter.sendMail(mailOption);
}

export const sendOTPVerifyEmail = async ({ email }: { email: string }) => {
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new Error('Email is invalid')
    //     const foundUser = await otpModel.findOne({email:email})
    // if(foundUser) throw new errorResponse.BadRequestError(`This email has been used by another user`)
    const foundOTP = await prisma.oTP.findUnique({ where: { email: email } })
    if (foundOTP) await prisma.oTP.delete({ where: { email: email } })
    const otp = `${Math.floor(Math.random() * 900000) + 100000}`

    const mailOptions = {
        from: 'hltdat2002@gmail.com',
        to: email,
        subject: 'Verify your email',
        html: `<p>Enter <b>${otp}</b> to verify your account`
    }

    const hashOTP = await bcrypt.hash(otp, 10)

    const userOTP = await prisma.oTP.create({
        data: {
            email: email,
            otp: hashOTP,
            verified:false,
            expiresAt: new Date(Date.now() + 300000)
        }
    })
    console.log('userotppp', userOTP)
    const transport = await sendOTPEmail(mailOptions)
    return userOTP  

}

export const notifyAccountLocked = async ({ email }: { email: string }) => {
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new Error('Email is invalid')
    //     const foundUser = await otpModel.findOne({email:email})
    // if(foundUser) throw new errorResponse.BadRequestError(`This email has been used by another user`)
    const foundOTP = await prisma.oTP.findUnique({ where: { email: email } })
    if (foundOTP) await prisma.oTP.delete({ where: { email: email } })
   
    const mailOptions = {
        from: 'hltdat2002@gmail.com',
        to: email,
        subject: 'Verify your email',
        html: `
            <p>Your account has been locked within 1 minute because of a lot of failed login requests.</p>
            <p>Please change your password as soon as posible.</p>
            `
    }
    const transport = await sendOTPEmail(mailOptions)
    return transport  

}

export const sendOTP = async ({ name, email, password }: { name: string, email: string, password: string }) => {
    console.log('emailotp', email)
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidName = await name.match(regex.nameRegex)
    if (isValidName === null) throw new errorResponse.BadRequestError('Tên không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ! Mật khẩu phải có ít nhất 1 chữ hoa, một ký tự đặc biệt và có độ dài từ 8-32 ký tự')

    const result = await sendOTPVerifyEmail({ email })
    if (result) {
        const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
        await client.connect()
        await client.set('userSign', JSON.stringify({ name, email, password }))
    }

    return result
}
export const verifyOTP = async ({ email, otp }: VerifyOTPProps) => {
    const foundOTP = await prisma.oTP.findUnique({ where: { email: email } })
    if (!foundOTP) throw new Error(`Have no any otp sent to this email`)

    const expires = foundOTP.expiresAt as any
    if (expires < Date.now()) throw new Error(`Otp expired`)

    const hashedOTP = foundOTP.otp
    const validOTP = await bcrypt.compare(otp, hashedOTP)
    if (!validOTP) throw new Error('Invalid code OTP')
    return await prisma.oTP.update({ where: { email: email }, data: { verified: true } })

}


export const resendOTP = async ({ email }: { email: string }) => {
    const foundOTP = await prisma.oTP.findUnique({where:{ email: email }})
    if (foundOTP) await prisma.oTP.delete({where:{ email: email }})
    const resend = await sendOTPVerifyEmail({ email });
    console.log('resend', resend)
    return resend;

}

