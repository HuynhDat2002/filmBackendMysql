import {Schema,model} from 'mongoose'

const DOCUMENT_NAME='KeyToken'
const COLLECTION_NAME='KeyTokens'

const keySchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },

    publicKey:{
        type:String,
        required:true
    },
    privateKey:{
        type:String,
        required:true
    },
    refreshTokensUsed:{
        type:Array,
        default:[]
    },
    refreshToken:{
        type:String,
        required:true
    }
},
{
    timestamps:true,
    collection:COLLECTION_NAME
})

export const keyTokenModel = model(DOCUMENT_NAME,keySchema)