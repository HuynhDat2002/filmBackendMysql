'use strict'

import { createChannel } from '@/utils'
import amqplib from 'amqplib'
import * as config from '@/configs/messageBroker.config'
import { errorResponse } from '@/cores'
import { successResponse } from '@/cores'
import { Request, Response, NextFunction } from 'express'
import { createClient } from 'redis'
import { CustomRequest } from '@/types'
const publishMessage = async (channel: amqplib.Channel, binding_key: string, message: string) => {

    await channel.publish(config.EXCHANGE_NAME, binding_key, Buffer.from(message))
    console.log(`Message has been sent: ${message}`)
}


//subscribe messages
const sendRBACRequest = async (message: { action: string, resource: string, role: string, service: string }) => {
    const channel = await createChannel()
   
    await publishMessage(channel, config.RBAC_BINDING_KEY, JSON.stringify(message) )
   
    
    const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
    await client.connect()
    let result:{service:string,status:string} = JSON.parse(await client.get('rbacresult') as string)
    setTimeout(async() => {
        if(result){
            await client.del('rbacresult')
        }
    }, 2000)
   if(result===null){
    result= JSON.parse(await client.get('rbacresult') as string)
   }
    console.log('redis result',result)
    return result
    // Timeout nếu không có phản hồi trong 5 giây


}
export const checkPermission = (action: string, resource: string) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {

        try {
            const userId: string = req.headers['x-client-id'] as string
            if (!userId) throw new errorResponse.AuthFailureError("Bạn cần phải đăng nhập trước.")
            let role = ""
            if (userId === req.admin?.id) {
                role = req.admin?.role as string
            }
            else if (userId === req.user?.id) role = req.user?.role as string

            if (!role) throw new errorResponse.AuthFailureError('You dont have permission to do this!')
            console.log('roleee', role)
            const rbacResponse = await sendRBACRequest({ action: action, resource: resource, role: role, service: "film" })
            console.log('rbacresponse film', rbacResponse)
            if(!rbacResponse) throw new errorResponse.AuthFailureError('You dont have permission to do this!')

            if (rbacResponse.status === "denied" || rbacResponse.status !== "success") throw new errorResponse.AuthFailureError('You dont have permission to do this!')
            next()
        }
        catch (error) {
            next(error)
        }

    }
}

// export const checkPermissionUser = (action: string, resource: string) => {
//     return async (req: CustomRequest, res: Response, next: NextFunction) => {

//         try {
//             const role = req.user?.role as string
//             if (!role) throw new errorResponse.AuthFailureError('You dont have permission to do this!')
//             const rbacResponse = await sendRBACRequest({ action: action, resource: resource, role: role, service: "film" })
//             console.log('rbacresponse', rbacResponse)
//              throw new errorResponse.AuthFailureError('You dont have permission to do this!')

//             // if (rbacResponse.status === "denied") throw new errorResponse.AuthFailureError('You dont have permission to do this!')
//             next()
//         }
//         catch (error) {
//             next(error)
//         }
//     }
// }