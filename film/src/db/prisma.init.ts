
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const connectDB= async ()=>{
    try{
        for(let i = 0; i < 5; i++) {
            try {
                await prisma.$connect();
                console.log(`Connect prisma successfully on attempt ${i + 1}`);
                return;
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === 4) {
                    throw error; // Rethrow the error on the last attempt
                }
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
            }
        }
        // const result = await prisma.$connect()
      
        // console.log(`Connect prisma successfully`)
    }
    catch (err){
        await prisma.$disconnect()
        console.log(`Cannot connect to prisma! ${err}`)
        process.exit();
    }
}