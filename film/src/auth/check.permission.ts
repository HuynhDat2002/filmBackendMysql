'use strict'

import { createChannel } from '@/utils'
import amqplib from 'amqplib'
import * as config from '@/configs/messageBroker.config'
import { errorResponse } from '@/cores'
import { successResponse } from '@/cores'
import {Request,Response,NextFunction} from 'express'
import {createClient} from 'redis'
import { CustomRequest } from '@/types'
const publishMessage = async (channel: amqplib.Channel, binding_key: string, message: string) => {

    await channel.publish(config.EXCHANGE_NAME, binding_key, Buffer.from(message))
    console.log(`Message has been sent: ${message}`)
}


//subscribe messages

const subscribeMessage = async (channel: amqplib.Channel)   => {
        try{

            const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
            await client.connect()
            const appQueue = await channel.assertQueue(config.QUEUE_NAME)
            channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME, config.FILM_BINDING_KEY)
            
            channel.consume(appQueue.queue, async (data: any) => {
                if (data !== null) {
                    console.log('received data rbac',data.content.toString())
const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
                    await client.connect()
                    await client.set('rbacResponse', data.content.toString())
                    channel.ack(data)
                }
            })
            console.log(`Subscribeddddddd`)
        }
        catch (error){
            throw error
        }
    
}

const sendRBACRequest = async (message: { action: string, resource: string, role: string, service: string }) => {
    const channel = await createChannel()
    await publishMessage(channel, config.RBAC_BINDING_KEY, JSON.stringify(message))
    await subscribeMessage(channel)
const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
    await client.connect()
    const data:{service:string,status:string} = JSON.parse(await client.get('rbacResponse') as string) ? JSON.parse(await client.get('rbacResponse') as string) :{service:"",status:""}
    await client.del("rbacResponse")
    //const data: {service:string,status:string} = JSON.parse(await client.get('resultRequestToRBAC') as string) ? JSON.parse(await client.get('resultRequestToRBAC') as string) : { service: "", status: ""}
   return data
}
export const checkPermission = (action: string, resource: string) => {
    return async (req:CustomRequest,res:Response,next:NextFunction)=>{

            try{
                const userId: string = req.headers['x-client-id'] as string
                if (!userId) throw new errorResponse.AuthFailureError("Bạn cần phải đăng nhập trước.")
                let role =""
                if(userId ===req.admin?.id){
                    role = req.admin?.role as string
                }
                else if(userId ===req.user?.id) role = req.user?.role as string
               
                if(!role) throw new errorResponse.AuthFailureError('You dont have permission to do this!')
                console.log('roleee',role)
                const rbacResponse = await sendRBACRequest({ action: action, resource: resource, role: role, service: "film" })
                console.log('rbacresponse',rbacResponse)
                if (!rbacResponse) throw new errorResponse.AuthFailureError('You dont have permission to do this!')
            
                if (rbacResponse.status === "denied") throw new errorResponse.AuthFailureError('You dont have permission to do this!')
                next()
            }
            catch (error){
                next(error)
            }
        
    }
}

export const checkPermissionUser = (action: string, resource: string) => {
    return async (req:CustomRequest,res:Response,next:NextFunction)=>{

            try{
                const role = req.user?.role as string
                if(!role) throw new errorResponse.AuthFailureError('You dont have permission to do this!')
                const rbacResponse = await sendRBACRequest({ action: action, resource: resource, role: role, service: "film" })
                console.log('rbacresponse',rbacResponse)
                if (!rbacResponse) throw new errorResponse.AuthFailureError('You dont have permission to do this!')
            
                if (rbacResponse.status === "denied") throw new errorResponse.AuthFailureError('You dont have permission to do this!')
                next()
            }
            catch (error){
                next(error)
            }   
    }
}