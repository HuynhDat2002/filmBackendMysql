
'use strict'
import 'dotenv/config'
import amqplib from 'amqplib'
import _ from 'lodash'
import {Types} from 'mongoose'
import * as config from '@/configs/messageBroker.config'
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

//---------------------------MESSAGE BROKER----------------------------

//create a channel
const createChannel = async ()=>{
    console.log('ms',config.MSG_QUEUE_URL)
    for (let i =0;i<6;i++){
        try{
           await amqplib.connect(config.MSG_QUEUE_URL,{frameMax:131072})
            console.log('Connect to rabbitmq successfully')
            break;
        }
        catch(err){
            console.error('Failed to connect to rabbitmq',err)
            await new Promise(resolve=>setTimeout(resolve,1000))
        }
    }
    const connection = await amqplib.connect(config.MSG_QUEUE_URL,{frameMax:131072})
    const channel = await connection.createChannel()
    await channel.assertExchange(config.EXCHANGE_NAME,'direct',{
      durable: true
    })
    return channel
}

export const clientRedis = async ()=>{
    console.log('ms',config.MSG_QUEUE_URL)
    for (let i =0;i<6;i++){
        try{
            const client = createClient({ url: "redis://redis-film:6379" })
            console.log('Connect to redis successfully')
            break;
        }
        catch(err){
            console.error('Failed to connect to redis',err)
            await new Promise(resolve=>setTimeout(resolve,3000))
        }
    }
    const client = createClient({ url: "redis://redis-film:6379" })

   
     return client
  }
  

//publish messages
const publishMessage = async (channel:amqplib.Channel,binding_key:string,message:string)=>{
    await channel.publish(config.EXCHANGE_NAME,binding_key,Buffer.from(message))
    console.log(`Message has been sent: ${message}`)
}

//subscribe messages

const subscribeMessage =  async (channel:amqplib.Channel,service:any)=>{
  const appQueue  = await channel.assertQueue(config.QUEUE_NAME)
  channel.bindQueue(appQueue.queue,config.EXCHANGE_NAME,config.FILM_BINDING_KEY)
  channel.consume(appQueue.queue,async (data:any)=>{
    if(data){
        console.log('received data')
        console.log(data.content.toString())
        const received = JSON.parse(data.content.toString())
        console.log('typeopreceive',typeof received)
        if(!received.service){
            service.SubscribeEvents(data.content.toString())
        }
        if(received.service==='rbac'){
            console.log('rbac',data.content.toString())
            const client = await clientRedis()
            await client.connect()
            await client.set('rbacresult', data.content.toString())
            console.log('aaaaa')
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