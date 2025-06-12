'use strict'

import { createChannel } from '@/utils'
import amqplib from 'amqplib'
import * as config from '@/configs/messageBroker.config'
import { errorResponse } from '@/cores'
import { successResponse } from '@/cores'
import {Request,Response,NextFunction} from 'express'
import {createClient} from 'redis'
import { CustomRequest } from '@/types'
import { clientRedis } from '@/utils'
// const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })

// client.connect()


const publishMessage = async (channel: amqplib.Channel, binding_key: string, message: string) => {

    await channel.publish(config.EXCHANGE_NAME, binding_key, Buffer.from(message))
    console.log(`Message has been sent: ${message}`)
}


//subscribe messages

export const subscribeMessageRBAC = async (channel: amqplib.Channel,callback: (data: { service: string, status: string }) => void )  => {
        try{


            const appQueue = await channel.assertQueue(config.QUEUE_NAME)
            channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME, config.USER_BINDING_KEY)
            
            channel.consume(appQueue.queue, async (data: any) => {

                if (data !== null) {
                        console.log('received data rbac from admin',data.content.toString())
                        const receivedData = await JSON.parse(data.content.toString())
                        callback(receivedData);
                        channel.ack(data)            
                }
            })

        }
        catch (error:any){
           
            throw error
        }
    
}

const sendRBACRequest = async (message: { action: string, resource: string, role: string, service: string }) => {
    const channel = await createChannel() as amqplib.Channel
    const client = await clientRedis()
    await client.connect()
    await client.del("rbacresult");
    await publishMessage(channel, config.RBAC_BINDING_KEY, JSON.stringify(message) )
    
     // Poll for the result in Redis
    const pollForResult = async () => {
        const start = Date.now();
        while (Date.now() - start < 10000) {
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
    
    console.log('redis result from admin',result)
    return result

}

export const checkPermission = (action: string, resource: string) => {
    return async (req:CustomRequest,res:Response,next:NextFunction)=>{

            try{
                const role = req.user?.role as string
                
                const rbacResponse = await sendRBACRequest({ action: action, resource: resource, role: role, service: "admin" })
                
                if (!rbacResponse) throw new errorResponse.AuthFailureError('You dont have permission to do this!')
            
                if (rbacResponse.status !== "success") throw new errorResponse.AuthFailureError('You dont have permission to do this!')
                next()
            }
            catch (error){
                next(error)
            }
        
    }
}