'use strict'
import {Request,Response,NextFunction} from 'express'
const asyncHandler = (fn:(req:Request,res:Response,next:NextFunction)=>Promise<any>)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        fn(req,res,next).catch(error=>next(error))
    }
}
export default asyncHandler