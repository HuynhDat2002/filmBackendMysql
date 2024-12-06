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
    setTimeout(() => {

    }, 2000)
    
    const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
    await client.connect()
    const result:{service:string,status:string} = JSON.parse(await client.get('rbacresult') as string)
    if(result){
        client.del('rbacresult')
    }
  
    console.log('redis result from user',result)
    return result
}

// }
export const checkPermission = (action: string, resource: string) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {

        try {
            const role = req.user?.role as string
            const rbacResponse = await sendRBACRequest({ action: action, resource: resource, role: role, service: "user" })
            console.log('rbacresponse', rbacResponse)
            if (!rbacResponse) throw new errorResponse.AuthFailureError('You dont have permission to do this!')

            if (rbacResponse.status === "denied") throw new errorResponse.AuthFailureError('You dont have permission to do this!')
            next()
        }
        catch (error) {
            next(error)
        }

    }
   
}