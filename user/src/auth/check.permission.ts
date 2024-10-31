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

// const subscribeMessage = async (channel: amqplib.Channel) => {
//     try {

//         const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
//         await client.connect()
//         const appQueue = await channel.assertQueue(config.QUEUE_NAME)
//         channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME, config.USER_BINDING_KEY)

//         channel.consume(appQueue.queue, async (data: any) => {
//             if (data !== null) {
//                 console.log('received data rbac', data.content.toString())
//                 const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
//                 await client.connect()
//                 await client.set('rbacResponse', data.content.toString())
//                 channel.ack(data)
//             }
//         })
//     }
//     catch (error) {
//         throw error
//     }

// }

// const sendRBACRequest = async (message: { action: string, resource: string, role: string, service: string }) => {
//     const channel = await createChannel()
//     await publishMessage(channel, config.RBAC_BINDING_KEY, JSON.stringify(message))
//     await subscribeMessage(channel)
// const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
//     await client.connect()
//     const data:{service:string,status:string} = JSON.parse(await client.get('rbacResponse') as string) ? JSON.parse(await client.get('rbacResponse') as string) :{service:"",status:""}
//     await client.del("rbacResponse")
//     //const data: {service:string,status:string} = JSON.parse(await client.get('resultRequestToRBAC') as string) ? JSON.parse(await client.get('resultRequestToRBAC') as string) : { service: "", status: ""}
//    return data
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

const sendRBACRequest = async (message: { action: string, resource: string, role: string, service: string }) => {
    const channel = await createChannel()
    await publishMessage(channel, config.RBAC_BINDING_KEY, JSON.stringify(message))
    const responsePromise = new Promise<{ service: string, status: string }>((resolve, reject) => {
       
        const timeout = setTimeout(() => reject(new Error("Timeout waiting for RBAC response")), 10000); // 5s timeout
            subscribeMessageRBAC(channel, resolve, reject);

    });
    const data = await responsePromise
    console.log('data received from rbac', data)
    return data
}

const subscribeMessageRBAC = async (channel: amqplib.Channel, callback: (data: { service: string, status: string }) => void, rejectCallback: (error: Error) => void) => {
    try {


        const appQueue = await channel.assertQueue(config.QUEUE_NAME)
        channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME, config.USER_BINDING_KEY)

        channel.consume(appQueue.queue, async (data: any) => {

            if (data !== null) {
                    console.log('received data from user', data.content.toString())
                    const receivedData = await JSON.parse(data.content.toString())
                    callback(receivedData);
                    channel.ack(data)
            }
        })

    }
    catch (error: any) {
        rejectCallback(new Error('Failed: ' + error.message));
        throw error
    }

}

