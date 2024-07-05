import "module-alias/register"
import config from '@/configs/mongodb.config'
import 'dotenv/config'
import express from 'express'
import adminApp from "@/app"
const adminServer= async ()=>{
    const app = express()
    adminApp(app)
    const server = app.listen(config.app.port,()=>{
        console.log(`Server starting on port ${config.app.port}`)
    })
}
adminServer()
