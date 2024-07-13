import {Schema,model} from 'mongoose'

const DOCUMENT_NAME='Rating'
const COLLECTION_NAME='Ratings'

const ratingSchema = new Schema({
    filmId:{type:String,required:true},
    ratings:[{
        userId:{type:String,required:String},
        rating:{type:Number}
    }],
    ratingAverage:{type:Number,default:0}
},
{
    timestamps:true,
    collection:COLLECTION_NAME
})
export const ratingModel = model(DOCUMENT_NAME,ratingSchema)