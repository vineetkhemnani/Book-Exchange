import mongoose from 'mongoose'
const { Schema,model } = mongoose

const exchangeRequestSchema = new Schema({
  bookOffered: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  bookRequested: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  offeredTo: {
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
