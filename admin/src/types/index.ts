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
    _id:string|Types.ObjectId;
    user:string|Types.ObjectId;
  publicKey:string;
  privateKey:string;
  refreshTokensUsed:string[]|null;
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
    password:string
}

export interface SignInProps{
    email:string,
    password:string
}

export interface TokenPairProps{
    accessToken:string,
    refreshToken:string
}

//------------------AUTH-------------------

export interface CreateTokenPairProps{
    payload:any,
    publicKey:string,
    privateKey:string
}

//---------UTILS-------------
export interface PayloadTokenPair extends jwt.JwtPayload {
    userId?:string;
    email?:string;
    iat?:number;
    exp?:number;
  }