import Book from '../models/bookModel.js'
import User from '../models/userModel.js'

// Add a new book
export const addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body
    const userId = req.user._id

    if (!title || !author || !genre) {
      return res.status(400).json({ error: 'Please fill all fields' })
    }

    const newBook = new Book({
      title,
      author,
      genre,
      listedBy: userId,
    })

    const savedBook = await newBook.save()

    // Add the book to the user's booksListed array
    const user = await User.findById(userId)
    user.booksListed.push(savedBook._id)
    await user.save()

    res.status(201).json(savedBook)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Controller to delete a book by its ID
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user._id;

    // Find the book by ID and ensure it belongs to the authenticated user
    const book = await Book.findOne({ _id: bookId, listedBy: userId });

    if (!book) {
      return res.status(404).json({ error: 'Book not found or not authorized to delete' });
    }

    // Delete the book
    await Book.findByIdAndDelete(bookId);

    res.status(200).json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit a book
export const editBook = async (req, res) => {
  try {
    const { bookId } = req.params
    const { title, author, genre } = req.body
    const userId = req.user._id

    const book = await Book.findById(bookId)

    if (!book) {
      return res.status(404).json({ error: 'Book not found' })
    }

    if (book.listedBy.toString() !== userId.toString()) {
      return res.status(401).json({ error: 'Not authorized' })
    }

    // Update book details
    book.title = title || book.title
    book.author = author || book.author
    book.genre = genre || book.genre

    const updatedBook = await book.save()

    res.json(updatedBook)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// Controller to get all books listed by the authenticated user
export const getUserBooks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all books listed by the user
    const books = await Book.find({ listedBy: userId });

    if (!books) {
      return res.status(404).json({ error: 'No books found for this user' });
    }

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
    res.status(200).json(books)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
    console.error('Error fetching books:', err)
  }
}