import "module-alias/register"
import movieApp from './src/app'
import config from '@/configs/mongodb.config'
import 'dotenv/config'
import express from "express"

const movieServer= async ()=>{
    const app = express()
    movieApp(app)
    const server = app.listen(config.app.port,()=>{
        console.log(`Server starting on port ${config.app.port}`)
    })
}
movieServer()
