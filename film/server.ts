import movieApp from './src/app'
import 'dotenv/config'
import express from "express"

const movieServer= async ()=>{
    const app = express()
    movieApp(app)
    const server = app.listen(process.env.DEV_APP_PORT,()=>{
        console.log(`Server starting on port ${process.env.DEV_APP_PORT}`)
    })
}
movieServer()
