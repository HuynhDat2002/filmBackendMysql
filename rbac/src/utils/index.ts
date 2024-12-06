
'use strict'

import 'dotenv/config'

import _ from 'lodash'
import { Types } from 'mongoose'
import * as config from '@/configs/messageBroker.config'
import amqplib from 'amqplib'
import { grantAccess } from '@/middlewares/rbac.middleware'
import * as regex from '@/middlewares/regex'
const convertToObjectId = (id: any) => {
    return new Types.ObjectId(id)
}

const getInfoData = (fields: string[], object = {}) => {
    return _.pick(object, fields)
}

const getSelectData = (select: any) => { //select is a array
    return Object.fromEntries(select.map((e: string) => [e, 1]))
}
const getUnSelectData = (unSelect: []) => {
    return Object.fromEntries(unSelect.map(e => [e, 0]))
}

const removeUndefinedObject = (obj: any) => {
    Object.keys(obj).forEach((key) => {

        if (obj[key] === null) {
            delete obj[key];
        }


    })
    return obj;
}

const updateNestedObjectParser = (obj: any) => {
    let final: any = {}
    removeUndefinedObject(obj);
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach(k => {
                final[`${key}.${k}`] = response[k]
            })
        }
        else {
            final[key] = obj[key]
        }
    })
    return final;
}

// ----------------------message broker-------------------------

//create a channel
const createChannel = async () => {
    const connection = await amqplib.connect(config.MSG_QUEUE_URL)
    const channel = await connection.createChannel()
    await channel.assertExchange(config.EXCHANGE_NAME, 'direct', {
        durable: true
    })
    return channel
}


//publish messages
const publishMessage = async (channel: amqplib.Channel, binding_key: string, message: string) => {

    await channel.publish(config.EXCHANGE_NAME, binding_key, Buffer.from(message))
    console.log(`Message has been sent: ${message}`)
}


//subscribe messages

const subscribeMessage = async (channel: amqplib.Channel) => {

    const appQueue = await channel.assertQueue('',{exclusive:true})
    channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME, config.RBAC_BINDING_KEY)
    console.log('key',config.FILM_BINDING_KEY)
    channel.consume(appQueue.queue, async (data: any) => {
        if (data !== null) {
            const message = await JSON.parse(data.content.toString())
            console.log('received data from rbac1',message)
            const grant = await grantAccess(message.action, message.resource, message.role)
            console.log('granttt',grant)
            if (message.service === "admin") {
                await publishMessage(channel, config.ADMIN_BINDING_KEY, JSON.stringify({service:"rbac",status:grant === true ? "success" : "denied"}))
            }
            if (message.service === "user") {
                await publishMessage(channel, config.USER_BINDING_KEY, JSON.stringify({service:"rbac",status:grant === true ? "success" : "denied"}))
            }
            if (message.service === "film") {
                await publishMessage(channel,"FILM_BINDING", JSON.stringify({service:"rbac",status:grant === true ? "success" : "denied"}))
            }
            
        }
    },{
        noAck:false
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