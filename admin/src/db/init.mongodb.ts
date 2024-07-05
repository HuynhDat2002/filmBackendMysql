'use strict'

import mongoose from "mongoose"
import config from '@/configs/mongodb.config'

const connectString = `mongodb+srv://${config.db.host}@cluster0.pmrwqoh.mongodb.net/${config.db.name}`

console.log(connectString)

class Database{
    private static instance: Database|null=null;
    constructor(){
        this.connect();
    }

    connect(type='mongodb'){
        if(1===1){
            mongoose.set('debug',true);
            mongoose.set('debug',{color:true});
        }
        mongoose
            .connect(connectString,{
                maxPoolSize:50
            })
            .then(()=>{
                console.log(`Connected To Mongodb!`)
            })
            .catch(err=>console.log('Error Connect!'))
    }
    static getInstance():Database{
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance()

export default instanceMongodb