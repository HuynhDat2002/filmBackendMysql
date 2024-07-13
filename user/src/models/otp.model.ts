'use strict'


import {Schema,model,Types} from 'mongoose'

const COLLECTION_NAME = 'UsersOTPVerify'
const DOCUMENT_NAME = 'UserOTPVerify'


const userOTPVerifySchema =new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{type:Date},
    verified:{
        type:Boolean,
        default:false
    }
},{
    timestamp:true,
    collection:COLLECTION_NAME
})

const otpModel = model(DOCUMENT_NAME,userOTPVerifySchema)

export {otpModel}



