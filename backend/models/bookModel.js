import mongoose from 'mongoose'
const { Schema, model } = mongoose

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  genreKeywords: [{
    type: String,
    required: true,
    trim: true,
  }],
  listedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateListed: {
    type: Date,
    default: Date.now,
  },
})

const Book = model('Book', bookSchema)
export default Book
