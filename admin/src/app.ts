import express,{Application,Request,Response,NextFunction} from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import checkOverload from '@/db/checkOverload'
import router from '@/routes'
import { subscribeMessage } from './utils'
import { createChannel } from './utils'
import { accessService } from './services'
import { connectDB } from './db/prisma.init'
import amqplib from 'amqplib'
import { clientRedis } from './utils'
import { subscribeMessageRBAC } from './auth/check.permission'
const app:Application  = express()


const adminApp = async (app:express.Express)=>{

    const corsOptions = {
        origin: ['https://localhost','https://localhost/adminpage',"https://www.google.com"], // Cho phép truy cập từ origin này
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
        credentials: true, // Cho phép sử dụng credentials mode
      };
    app.use(cors(corsOptions)) // trao đổi tài nguyên chéo
    app.use(morgan('dev')) // trạng thái code
    app.use(helmet()) //bảo mật server bằng cách đặt các header bảo mật http khác nhau
    app.use(compression()) //giảm băng thông
    app.use(express.json()) // phân tích các yêu cầu json, đặt dữ liệu vào req.body
    app.use(express.urlencoded({extended:false}))//xử lý dữ liệu form URL-encoded trong các yêu cầu HTTP POST.
    // extended:false đơn giản và không sử dụng cấu trúc dữ liệu phức tạp
    app.use(cookieParser(process.env.COOKIE_SESSION_SECRET))
    
    //connect to db
    connectDB()
    
    //checking overload
    checkOverload()

    //create channel
    const channel = await createChannel() as amqplib.Channel
   // subscribe message
    await subscribeMessage(channel) 
    // await subscribeMessageRBAC(channel)
    app.use('/admin/',router)
    
    //handling error notfound
    app.use((req:Request,res:Response,next:NextFunction)=>{
        const error:any = new Error('Not found')
        error.status = 404
        next(error)
    })
    
    //handling error
    app.use((error:any,req:Request,res:Response,next:NextFunction)=>{
        const status:number = error.status || 500;
        return res.status(status).json({
            status:status,
            message:error.message,
            stack:error.stack
        })
    })
    
}

export default adminApp;