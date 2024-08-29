import mongoose from 'mongoose'
const { Schema,model } = mongoose

const exchangeRequestSchema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookRequested: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  listedBy: {
    // owner of the book
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },


  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  dateRequested: {
    type: Date,
    default: Date.now,
  },
})

const ExchangeRequest = model('ExchangeRequest', exchangeRequestSchema)
export default ExchangeRequest
