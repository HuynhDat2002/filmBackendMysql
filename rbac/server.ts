import 'dotenv/config'
import express from 'express'
import userApp from "@/app"
const userServer= async ()=>{
    const app = express()
    userApp(app)
    const server = app.listen(process.env.DEV_APP_PORT,()=>{
        console.log(`Server starting on port ${process.env.DEV_APP_PORT}`)
    })
}
userServer()
