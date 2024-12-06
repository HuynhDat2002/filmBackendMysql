
'use strict'

import 'dotenv/config'
import _ from 'lodash'
import {Types} from 'mongoose'
import * as config from '@/configs/messageBroker.config'
import amqplib from 'amqplib'
import { errorResponse } from '@/cores'
import { createClient } from 'redis'

const convertToObjectId = (id:any)=>{
    return new Types.ObjectId(id)
}

const getInfoData = (fields:string[],object={}) =>{
    return _.pick(object,fields)
}

const getSelectData = (select:any)=>{ //select is a array
    return Object.fromEntries(select.map((e:string)=>[e,1]))
}
const getUnSelectData = (unSelect:[])=>{
    return Object.fromEntries(unSelect.map(e=>[e,0]))
}

const removeUndefinedObject = (obj:any) =>{
    Object.keys(obj).forEach((key)=>{
        
            if(obj[key]===null){    
                delete obj[key];
            }
        
       
    })
    return obj;
}

const updateNestedObjectParser = (obj:any)=>{
    let final:any={}
    removeUndefinedObject(obj);
    Object.keys(obj).forEach((key)=>{
        if(typeof obj[key]==="object" && !Array.isArray(obj[key])){
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach(k=>{
                final[`${key}.${k}`]=response[k]
            })
        }
        else{
            final[key]=obj[key]
        }
    })
    return final;
}

// ----------------------message broker-------------------------

//create a channel
 const createChannel = async () : Promise<amqplib.Channel>=>{
    let retries = 3
    while (retries>0){

        try{
            console.log(config.MSG_QUEUE_URL)
            const connection = await amqplib.connect("amqps://manhlcbi:4RaEAOXMu4G3hABsnlRwZ8-1OMl83JOS@octopus.rmq3.cloudamqp.com/manhlcbi")
            const channel = await connection.createChannel()
            await channel.assertExchange(config.EXCHANGE_NAME,'direct',{
              durable: true
            })
            console.log('Connect to rabbitmq successfully')
            return channel
        }
        catch (error){
            console.log(`Loi ket noi rabbitmq`)
            console.log(error)
            retries -=1;
            if(retries===0) throw new errorResponse.BadRequestError('Ket noi rabbitmq that bai')
            await new Promise(resolve=>setTimeout(resolve,3000))

        }
    }
    throw new errorResponse.BadRequestError('Không thể tạo kênh kết nối RabbitMQ');
  }
  
  
  //publish messages
   const publishMessage = async (channel:amqplib.Channel,binding_key:string,message:string)=>{
    
    await channel.publish(config.EXCHANGE_NAME,binding_key,Buffer.from(message))
    console.log(`Message has been sent: ${message}`)
  }
  
  
  //subscribe messages
  
 const subscribeMessage =  async (channel:amqplib.Channel)=>{
  
  
    const appQueue  = await channel.assertQueue(config.QUEUE_NAME)
    channel.bindQueue(appQueue.queue,config.EXCHANGE_NAME,config.USER_BINDING_KEY)
   
    channel.consume(appQueue.queue, async (data:any)=>{
        if(data){
            console.log('received data from user')
            console.log(data.content.toString())
            const received = JSON.parse(data.content.toString())
            if(received.service==='rbac'){
                console.log('rbac from user',data.content.toString())
                const client = createClient({ url: "redis://default:pyFDvQLFTafTwKZ4QuVTYynBWDrjxcE3@redis-11938.c15.us-east-1-2.ec2.redns.redis-cloud.com:11938" })
                await client.connect()
            await client.del('rbacresult')

                await client.set('rbacresult', data.content.toString())
                console.log('from user')
            }
            channel.ack(data)

        }
    })
    console.log(`Subscribed`)
  
  }

export {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectId,
    createChannel,
    publishMessage,
    subscribeMessage
}