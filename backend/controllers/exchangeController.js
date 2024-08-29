import Book from "../models/bookModel.js";
import ExchangeRequest from "../models/exchangeRequestModel.js";

export const createExchangeRequest=async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId).populate('listedBy');
    if (!book) return res.status(404).send('Book not found');

    const exchangeRequest = new ExchangeRequest({
      requestedBy: req.user._id,
      bookRequested: book._id,
      listedBy: book.listedBy._id,
    });

    await exchangeRequest.save();
    // console.log(`Exchange request created by ${req.user.username} and book was listed by ${book.listedBy}`)
    res.status(201).json({
      exchangeRequest: exchangeRequest,
      requestedBy: req.user.username,
      listedBy: book.listedBy.username,
    })
  } catch (error) {
    res.status(500).send('Server error');
  }
}