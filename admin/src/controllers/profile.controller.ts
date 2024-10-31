'use strict'

import { successResponse } from "@/cores"
import { Request, Response, NextFunction } from 'express'

const profilesList = [
    {
        usr_id: 1,
        usr_name: 'trongdat'
    },
    {
        usr_id: 2,
        usr_name: 'vanthanh'
    },
    {
        usr_id: 3,
        usr_name: 'luongtrai'
    },
    {
        usr_id: 4,
        usr_name: 'ngoctram'
    }
]

//admin
export const profiles = async (req: Request, res: Response, next: NextFunction) => {
    new successResponse.SuccessResonse({
        message: 'view all profiles',
        metadata: profilesList
    }).send(res)
}

//shop
export const profile = async (req: Request, res: Response, next: NextFunction) => {
    new successResponse.SuccessResonse({
        message: 'view all profiles',
        metadata: {
            usr_id: 2,
            usr_name: 'vanthanh'
        }

    }).send(res)
}