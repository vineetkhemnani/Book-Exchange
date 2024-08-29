import Book from '../models/bookModel.js'
import ExchangeRequest from '../models/exchangeRequestModel.js'

export const createExchangeRequest = async (req, res) => {
  try {
    const currentUser = req.user
    const { bookId } = req.body
    const book = await Book.findById(bookId).populate('listedBy')
    if (!book) return res.status(404).send('Book not found')

    const exchangeRequest = new ExchangeRequest({
      requestedBy: currentUser,
      bookRequested: book,
      listedBy: book.listedBy,
    })

    const savedRequest = await exchangeRequest.save()

    // console.log(`Exchange request created by ${req.user.username} and book was listed by ${book.listedBy}`)
    res.status(201).json(savedRequest)
  } catch (error) {
    res.status(500).send('Server error')
  }
}

// outgoing request details
export const getExchangeReqMadebyUser = async (req, res) => {
  try {
    const userId = req.user._id
    const requests = await ExchangeRequest.find({ requestedBy: userId })
      .populate('bookRequested', 'title author') // Populate book details
      .populate('listedBy', 'username') // Populate owner details

    res.status(200).json(requests)
  } catch (error) {
    res.status(500).send('Server error')
  }
}

export const respondToExchangeRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { action } = req.body
    const currentUser = req.user

    if (action !== 'accept' && action !== 'reject') {
      return res
        .status(400)
        .json({ message: "Action must be 'accept' or 'reject'" })
    }
    const originalRequest = await ExchangeRequest.findById(id)
    const bookOwner = originalRequest.listedBy
    
    if (currentUser._id.toString() !== bookOwner.toString()) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const status = action === 'accept' ? 'accepted' : 'rejected'

    const updatedRequest = await ExchangeRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('requestedBy', 'username email')
      .populate('bookRequested', 'title author')
      .populate('listedBy', 'username email')

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Exchange request not found' })
    }

    res.status(200).json({
      message: `Exchange request ${status}`,
      request: updatedRequest,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete an exchange request
export const deleteExchangeRequest = async (req, res) => {
  try {
    const deletedRequest = await ExchangeRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Exchange request not found' });
    }
    res.status(200).json({ message: 'Exchange request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// incoming requests
export const getIncomingExchangeRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id; 

    const requests = await ExchangeRequest.find({ listedBy: currentUserId })
      .populate('requestedBy', 'username email')
      .populate('bookRequested', 'title author')
      .sort({ dateRequested: -1 });

    res.status(200).json({
      count: requests.length,
      requests: requests
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incoming exchange requests', error: error.message });
  }
};