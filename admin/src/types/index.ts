import { SuccessResonse } from '../cores/success.response';
import * as jwt from 'jsonwebtoken'
import {Request} from 'express'
import {Types } from 'mongoose'
export interface CustomRequest extends Request{
    keyToken?: KeyTokenModelProps,
    user?:PayloadTokenPair
    refreshToken?:string
}


//------------MODELS-------------------
export interface KeyTokenModelProps{
    id:string|Types.ObjectId;
    userId:string|Types.ObjectId;
  publicKey:string;
  privateKey:string;
//   refreshTokensUsed:string[]|null;
  refreshToken:string
}
//-----------------------CONFIGS-------------------

export interface ConfigDB{
    dev:ConfigEnvironment,
    [key:string]:ConfigEnvironment
}

export interface ConfigEnvironment{
    app:{port:number},
    db:{host:string,name:string}
  
}

export interface SuccessResonseProps{
    message?:string,
    metadata?:any,
    statusCode?:number,
    responseStatusCode?:string,
}

// ---------------------SERVICES------------------

export interface SignUpProps{
    name:string,
    email:string,
    password:string,
    role?:string
}

export interface SignInProps{
    email:string,
    password:string,
    userAgent:string,
    tokenCaptcha:string
}

export interface TokenPairProps{
    accessToken:string,
    refreshToken:string
}

export interface VerifyOTPProps{
    email:string,
    otp:string
}

export interface CheckDevice{
    email:string,
    password:string,
    userAgent:string

  
}

//------------------AUTH-------------------

export interface CreateTokenPairProps{
    payload:any,
    publicKey:string,
    privateKey:string
}

export interface Captcha {
    
    success: false|true, 
    "error-codes"?: string[]       

   
    challenge_ts?: string, 
    hostname?: string, 
    score:number,
    action?:string,       
}

//---------UTILS-------------
export interface PayloadTokenPair extends jwt.JwtPayload {
    userId?:string;
    email?:string;
    role?:string;
    iat?:number;
    exp?:number;
  }

