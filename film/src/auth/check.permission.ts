'use strict'

import { createChannel } from '@/utils'
import amqplib from 'amqplib'
import * as config from '@/configs/messageBroker.config'
import { errorResponse } from '@/cores'
import { successResponse } from '@/cores'
import { Request, Response, NextFunction } from 'express'
import { createClient } from 'redis'
import { CustomRequest } from '@/types'
import { clientRedis } from '@/utils'
const publishMessage = async (channel: amqplib.Channel, binding_key: string, message: string) => {

    await channel.publish(config.EXCHANGE_NAME, binding_key, Buffer.from(message))
    console.log(`Message has been sent: ${message}`)
}


//subscribe messages
const sendRBACRequest = async (message: { action: string, resource: string, role: string, service: string }) => {
    const channel = await createChannel() as amqplib.Channel
    const client = await clientRedis()
    await client.connect()
    await client.del("rbacresult");
    await publishMessage(channel, config.RBAC_BINDING_KEY, JSON.stringify(message) )
    // let result:{service:string,status:string} =await JSON.parse(await client.get('rbacresult') as string)
    
     // Poll for the result in Redis
    const pollForResult = async () => {
        const start = Date.now();
        while (Date.now() - start < 5000) {
            const result = await client.get("rbacresult");
            if (result) {
                return JSON.parse(result);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for `interval` ms
        }
        throw new Error("Timeout waiting for RBAC result from Redis");
    };
    const result = await pollForResult();
//    if(result===null){
//     result= JSON.parse(await client.get('rbacresult') as string)
//    }
    
    console.log('redis result from film',result)
    return result

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