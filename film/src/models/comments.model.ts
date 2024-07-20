import {model,Schema} from 'mongoose'

const DOCUMENT_NAME='Comment'
const COLLECTION_NAME='Comments'

const commentSchema = new Schema({
    comment_filmId: {type:String,required:true},
    comment_user:{
        _id:{type:String},
        name:{type:String},
        email:{type:String}
    },
    comment_content:{type:String,default:"text"},
    comment_left:{type:Number,default:0},
    comment_right:{type:Number,default:0},
    comment_parentId:{type:Schema.Types.ObjectId,ref:DOCUMENT_NAME},
    isDeleted:{type:Boolean,default:false}
},{
    timestamps:true,
    collection:COLLECTION_NAME
})

const commentModel = model(DOCUMENT_NAME,commentSchema);
export {commentModel}