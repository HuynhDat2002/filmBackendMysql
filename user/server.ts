// import "module-alias/register"
import 'dotenv/config'
import express from 'express'
import userApp from "./src/app"
const userServer= ()=>{
    console.log('hello from server')
    const app = express()
    userApp(app)
    const server = app.listen(process.env.DEV_APP_PORT,()=>{
        console.log(`Server starting on port ${process.env.DEV_APP_PORT}`)
    })
}
userServer()
