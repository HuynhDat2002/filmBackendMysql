
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export const connectDB= async ()=>{
    try{
        const result = await prisma.$connect()
      
            console.log(`Connect prisma successfully`)
    }
    catch (err){
        await prisma.$disconnect()
        console.log(`Cannot connect to prisma! ${err}`)
        process.exit();
    }
}