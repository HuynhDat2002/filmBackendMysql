'use strict'

import os from 'os'
import process from "process"
import {prisma} from './prisma.init'

const checkOverload = async ()=>{
    setInterval(()=>{
        const numConnections = prisma.$connect.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConnections = numCores*5
        
        console.log(`Active Connections: ${numConnections}`)
        console.log(`Memory usage: ${memoryUsage/1024/1024}MB`)
        console.log(`Max connections: ${maxConnections}`)
        if(numConnections>maxConnections) console.log(`Connection overload detected`)
    },10000)
}
export default checkOverload