import { ConfigDB,ConfigEnvironment } from "@/types"
import 'dotenv/config'
const dev:ConfigEnvironment={
    app:{
        port:parseInt(process.env.DEV_APP_PORT||"5004"),
    },
    db:{
        host:process.env.DB_HOST as string,
        name:process.env.DB_NAME as string
    }
}

const config:ConfigDB={dev}

const env:string = process.env.NODE_ENV ||'dev'
export default config[env]