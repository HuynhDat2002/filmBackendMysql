'use strict'

import nodemailer from 'nodemailer'
import {userModel} from '@/models/access.model'
import bcrypt from 'bcrypt'
import { otpModel } from '../models/otp.model';
import { VerifyOTPProps } from '@/types';
import { errorResponse } from '@/cores';
import { createClient } from 'redis'
import * as regex from '@/middlewares/regex'
const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.email",
    port: 535,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "hltdat2002@gmail.com",
      pass: "kzfm sukb lpjz wsju",
    },
  });

export const sendOTPEmail = async (mailOption:any)=>{
    return await transporter.sendMail(mailOption);
}

export const sendOTPVerifyEmail = async ({email}:{email:string})=>{
    const isValidEmail =await email.match(regex.emailRegex)
    if(isValidEmail===null) throw new Error('Email is invalid')
//     const foundUser = await otpModel.findOne({email:email})
// if(foundUser) throw new errorResponse.BadRequestError(`This email has been used by another user`)
    const foundOTP = await otpModel.findOne({email:email})
    if(foundOTP) await otpModel.findOneAndDelete({email:email})
    const otp = `${Math.floor(Math.random()*900000)+100000}`

    const mailOptions={
        from:'hltdat2002@gmail.com',
        to:email,
        subject:'Verify your email',
        html:`<p>Enter <b>${otp}</b> to verify your account`
    }

    const hashOTP = await bcrypt.hash(otp,10)

    const userOTP = await otpModel.create({
        email:email,
        otp: hashOTP,
        expiresAt:Date.now()+300000
    })
    console.log('userotppp',userOTP)
   const transport=await sendOTPEmail(mailOptions)
   return userOTP
    
}


export const sendOTP = async ({name,email,password}:{name:string,email:string,password:string})=>{
    const isValidEmail = await email.match(regex.emailRegex)
    if (isValidEmail === null) throw new errorResponse.BadRequestError('Email không hợp lệ')
    const isValidName = await name.match(regex.nameRegex)
    if (isValidName === null) throw new errorResponse.BadRequestError('Tên không hợp lệ')
    const isValidPassword = await password.match(regex.passwordRegex)
    if (isValidPassword === null) throw new errorResponse.BadRequestError('Mật khẩu không hợp lệ! Mật khẩu phải có ít nhất 1 chữ hoa, một ký tự đặc biệt và có độ dài từ 8-32 ký tự')

    const result =  await sendOTPVerifyEmail({email})
   if(result) {
    const client = createClient()
    await client.connect()
    await client.set('userSign', JSON.stringify({name,email,password}))
   }
   return result
}
export const verifyOTP = async ({email,otp}:VerifyOTPProps)=>{
    const foundOTP = await otpModel.findOne({email:email})
    if(!foundOTP) throw new Error(`Have no any otp sent to this email`)

    const expires = foundOTP.expiresAt as any
    if(expires<Date.now()) throw new Error(`Otp expired`)

    const hashedOTP = foundOTP.otp
   const validOTP = await bcrypt.compare(otp,hashedOTP)
   if(!validOTP) throw new Error('Invalid code OTP')
   
  return await otpModel.findOneAndUpdate({email:email},{verified:true},{new:true})
   
}


export const resendOTP = async ({email}:{email:string})=>{
    const foundOTP = await otpModel.findOne({email:email})
    if(foundOTP) await otpModel.deleteOne({email:email})
    const resend= await sendOTPVerifyEmail({email});
    console.log('resend',resend)
    return resend;
    
}

