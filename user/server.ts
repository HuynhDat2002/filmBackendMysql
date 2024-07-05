import "module-alias/register"
import config from '@/configs/mongodb.config'
import 'dotenv/config'
import express from 'express'
import userApp from "@/app"
const userServer= async ()=>{
    const app = express()
    userApp(app)
    const server = app.listen(config.app.port,()=>{
        console.log(`Server starting on port ${config.app.port}`)
    })
}
userServer()
