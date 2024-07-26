import {Schema,model} from 'mongoose'

const DOCUMENT_NAME='TV'
const COLLECTION_NAME='TVs'

const tvSchema = new Schema({
   name:{
    type:String,
    required:true
   },
   slug:{
    type:String
   },
   origin_name:{
    type:String,
    unique:true
   },
   content:{
    type:String,
    required:true
   },
   poster_url:{
    type:String
   },
   thumb_url:{
    type:String
   },
   trailer:{
    type:String,
    default:"",
   },
   time:{
    type:String
   },
   lang:{
    type:String
   },
   year:{
    type:Number
   },
   view:{
        type:Number,
        default:0
   },
   actor:{  
    type: Array,
    default:[]
   },
   director:{
    type:Array,
    default:[]
   },
   category:[
    {
        name:{type:String},
        slug:{type:String}
    }
   ],
   country:[
    {
        name:{type:String},
        slug:{type:String}
    }
   ],
   quality:{
    type:String,
    required:true
   },
   episode_current:{
    type:String
   },
   episode_total:{
    type:Number
   },
   episodes:[
    {
        name:{type:String},
        slug:{type:String},
        video:{type:String}
    }
   ],
   type:{type:String,default:'tvshow'},
   rating:{type:Number,default:0}


},
{
    timestamps:true,
    collection:COLLECTION_NAME
})
tvSchema.index({ name: 'text',origin_name:'text',slug:'text'});
export const tvModel = model(DOCUMENT_NAME,tvSchema)