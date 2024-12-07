'use strict'

import {Request,Response,NextFunction} from 'express'
import { successResponse } from '@/cores'
import { accessService } from '@/services'
import { CustomRequest, KeyTokenModelProps } from '@/types'
import { resolve } from 'path/win32'
import { PayloadTokenPair } from '@/types'
import { otpService } from '@/services'

export const signUp = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.Created({
        message:"Created a new user",
        metadata: await accessService.signUp(req.body)
    }).send(res)
}
export const checkDevice = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userAgent = req.headers['user-agent'] as string
    // res.cookie('logininfo', metadata.tokens, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000, // Thời gian sống của cookie, ví dụ 1 ngày
    //     sameSite: 'none'
    // });
    new successResponse.SuccessResonse({
        message: "Check device",
        metadata: await accessService.checkDevice({email:req.body.email,password:req.body.password,userAgent})
    }).send(res)
}

export const signIn = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const userAgent = req.headers['user-agent'] as string
    new successResponse.SuccessResonse({
        message:"Login Successfully",
        metadata: await accessService.signIn({email:req.body.email,password:req.body.password,userAgent,tokenCaptcha:req.body.tokenCaptcha})
    }).send(res)
}
export const forgotPassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
    new successResponse.SuccessResonse({
        message: "Forgot Successfully",
        metadata: await accessService.forgotPassword(req.body)
    }).send(res)
}

export const verifyOTP = async (req: CustomRequest, res: Response, next: NextFunction) => {
    new successResponse.SuccessResonse({
        message: "Verify Successfully",
        metadata: await otpService.verifyOTP(req.body)
    }).send(res)
}


export const logOut = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    new successResponse.SuccessResonse({
        message:"Logout Successfully",
        metadata: await accessService.logout(req.keyToken as KeyTokenModelProps)
    }).send(res)
}

export const getPayloadAdmin = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const adminId = req.user?.userId as string
    new successResponse.SuccessResonse({
        message:"Successfully",
        metadata: await accessService.getPayloadAdmin(adminId)
    }).send(res)
}

export const getUser = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const user=req.user as PayloadTokenPair
   
    new successResponse.SuccessResonse({
        message:"Got User Successfully",
        metadata: await accessService.getUser({userId:user.userId as string})
    }).send(res)
}

export const editUser = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const user=req.user as PayloadTokenPair
   
    new successResponse.SuccessResonse({
        message:"Edited User Successfully",
        metadata: await accessService.editUser({userId:user.userId as string,payload:req.body})
    }).send(res)
}

export const changePassword = async (req:CustomRequest,res:Response,next:NextFunction)=>{
    const user=req.user as PayloadTokenPair
    const {password,newPassword} = req.body
    new successResponse.SuccessResonse({
        message:"Changed Password Successfully",
        metadata: await accessService.changePassword({user,password,newPassword})
    }).send(res)
}


export const resetPassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
    new successResponse.SuccessResonse({
        message: "Reset password Successfully",
        metadata: await accessService.resetPassword(req.body)
    }).send(res)
}

export const sendOTP = async (req: CustomRequest, res: Response, next: NextFunction) => {
    new successResponse.SuccessResonse({
        message: "Sent OTP Successfully",
        metadata: await otpService.sendOTP(req.body)
    }).send(res)
}
export const getUserList = async (req: CustomRequest, res: Response, next: NextFunction) => {
    new successResponse.SuccessResonse({
        message: "Get User List Successfully",
        metadata: await accessService.getUserList()
    }).send(res)
}


export const deleteUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.params.id as string
    new successResponse.SuccessResonse({
        message: "Delete User Successfully",
        metadata: await accessService.deleteUser({userId:userId})
    }).send(res)
}
