import {Schema,model} from 'mongoose'

const DOCUMENT_NAME='User'
const COLLECTION_NAME='Users'

const adminSchema = new Schema({
   name:{
        type:String,
        trim:true
   },
   email:{
    type:String,
    unique:true,
    trim:true
   },
   password:{
    type:String,
    required:true
   },
  role:{
    type:String,
    default:"ADMIN"
  }
},
{
    timestamps:true,
    collection:COLLECTION_NAME
})

export const adminModel = model(DOCUMENT_NAME,adminSchema)