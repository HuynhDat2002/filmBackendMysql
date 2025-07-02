import 'dotenv/config'
import express from 'express'
import adminApp from "@/app"
const adminServer= async ()=>{
    const app = express()
    adminApp(app)
    const server = app.listen(process.env.DEV_APP_PORT,()=>{
        console.log(`Server starting on port ${process.env.DEV_APP_PORT}`)
    })
}
adminServer()
