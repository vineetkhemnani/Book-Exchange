import express from 'express'
import {
  addBook,
  deleteBook,
  editBook,
  getAllBooks,
  getUserBooks,
  getBooksByOtherUsers,
  getMatchingBooks,
} from '../controllers/bookController.js'
import protectRoute from '../middlewares/protectRoute.js' // Assuming you have an auth middleware to protect routes

const router = express.Router()

// Route to add a book
router.post('/add', protectRoute, addBook)

// Route to delete a book
router.delete('/delete/:bookId', protectRoute, deleteBook)

// Route to edit a book
router.put('/:bookId', protectRoute, editBook)

// get all books listed by user
router.get('/mybooks', protectRoute, getUserBooks)

// get all books
router.get('/allbooks', protectRoute, getAllBooks)

// get books listed by others
router.get('/others', protectRoute, getBooksByOtherUsers)

router.get('/matchbooks', protectRoute, getMatchingBooks)

export default router
