import "module-alias/register"
import app from './src/app'
import config from '@/configs/mongodb.config'
import 'dotenv/config'

const server = app.listen(config.app.port,()=>{
    console.log(`Server starting on port ${config.app.port}`)
})
