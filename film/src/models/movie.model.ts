import {Schema,model} from 'mongoose'

const DOCUMENT_NAME='Movie'
const COLLECTION_NAME='Movies'

const movieSchema = new Schema({
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
   video:{
    type:String,
    default:""
   },
   type:{type:String,default:'movie'},
   

},
{
    timestamps:true,
    collection:COLLECTION_NAME
})
movieSchema.index({ name: 'text',origin_name:'text',slug:'text'});
export const movieModel = model(DOCUMENT_NAME,movieSchema)