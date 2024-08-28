import mongoose from 'mongoose'
const { Schema,model } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  booksListed: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  booksInterestedIn: [
    {
      type: String,
      trim: true,
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
})

const User = model('User', userSchema)
export default User
