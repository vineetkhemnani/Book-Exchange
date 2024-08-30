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

    user.genreInterestedIn = [
      ...new Set([...user.genreInterestedIn, genre.toLowerCase()]),
    ]
    await user.save()
    res.status(201).json(savedBook)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Controller to delete a book by its ID
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.bookId
    const userId = req.user._id

    const user = await User.findById(userId)

    // Find the book by ID and ensure it belongs to the authenticated user
    const book = await Book.findOne({ _id: bookId, listedBy: userId })

    if (!book) {
      return res
        .status(404)
        .json({ error: 'Book not found or not authorized to delete' })
    }

    // Delete the book
    await Book.findByIdAndDelete(bookId)

    // also remove it from booksListed in user model
    // Remove the book reference from the user's booksListed array
    user.booksListed = user.booksListed.filter(
      (listedBookId) => listedBookId.toString() !== bookId
    )

    // Remove the book's genre from the user's genreInterestedIn array
    // Only if there are no other books by the user with the same genre
    const userHasOtherBooksInGenre = await Book.exists({
      listedBy: userId,
      genre: book.genre,
      _id: { $ne: bookId },
    })

    if (!userHasOtherBooksInGenre) {
      user.genreInterestedIn = user.genreInterestedIn.filter(
        (genre) => genre.toLowerCase() !== book.genre.toLowerCase()
      )
    }

    await user.save()
    res.status(200).json({ message: 'Book removed' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const editBook = async (req, res) => {
  try {
    const { bookId } = req.params
    const { title, author, genre } = req.body
    const userId = req.user._id
    const user = req.user

    const book = await Book.findById(bookId)

    if (!book) {
      return res.status(404).json({ error: 'Book not found' })
    }

    if (book.listedBy.toString() !== userId.toString()) {
      return res.status(401).json({ error: 'Not authorized' })
    }

    // Update book details
    const previousGenre = book.genre
    book.title = title || book.title
    book.author = author || book.author
    book.genre = genre || book.genre

    const updatedBook = await book.save()

    if (previousGenre !== book.genre) {
      // Check if user has other books from previous genre
      const userHasOtherBooksInPreviousGenre = await Book.exists({
        listedBy: userId,
        genre: previousGenre,
        _id: { $ne: bookId },
      })

      // console.log(userHasOtherBooksInPreviousGenre)
      // If user has no books from previous genre, remove that genre from user.genreInterestedIn array
      if (!userHasOtherBooksInPreviousGenre) {
        console.log("no book")
        user.genreInterestedIn = user.genreInterestedIn.filter(
          (g) => g.toLowerCase() !== previousGenre.toLowerCase()
        )
      } else {
          user.genreInterestedIn.push(book.genre.toLowerCase())

      }

      await user.save()
    }

    res.json(updatedBook)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Controller to get all books listed by the authenticated user
export const getUserBooks = async (req, res) => {
  try {
    const userId = req.user._id

    // Find all books listed by the user
    const books = await Book.find({ listedBy: userId })

    if (!books) {
      return res.status(404).json({ error: 'No books found for this user' })
    }

    res.status(200).json(books)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

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

export const getBooksByOtherUsers = async (req, res) => {
  try {
    // Find books where the owner is not the logged-in user
    const books = await Book.find({ listedBy: { $ne: req.user._id } }).populate(
      'listedBy',
      'username email'
    )

    if (!books.length) {
      return res.status(404).json({ message: 'No books found by other users' })
    }

    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
    console.error('Error fetching books by other users:', error)
  }
}

// need to work on
export const getMatchingBooks = async (req, res) => {
  //   try {
  //     const currentUser = req.user
  //     const books = await Book.find({
  //       listedBy: { $ne: currentUser._id },
  //     }).populate('listedBy', 'username email')
  //     const filteredBooks = books.filter((book) => {
  //       // Check if any genre in genreKeywords matches a genre in genreInterestedIn
  //       const hasMatchingGenre = book.genreKeywords.some((genre) =>
  //         currentUser.genreInterestedIn.includes(genre.toLowerCase().trim())
  //       )
  //       return hasMatchingGenre && book.listedBy !== currentUser._id
  //     })
  //     if (!filteredBooks.length) {
  //       return res.status(404).json({ message: 'No books found by other users' })
  //     }
  //     res.status(200).json(filteredBooks)
  //   } catch (error) {
  //     res.status(500).json({ message: error.message })
  //     console.error('Error fetching books by other users:', error)
  //   }
}
