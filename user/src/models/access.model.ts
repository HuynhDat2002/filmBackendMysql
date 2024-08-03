import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "USER"
  },
  userAgent: {
    type:Array,
    default:[]
  }
},
  {
    timestamps: true,
    collection: COLLECTION_NAME
  })

export const userModel = model(DOCUMENT_NAME, userSchema)