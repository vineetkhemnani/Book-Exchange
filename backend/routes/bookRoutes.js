import express from 'express'
import { addBook, deleteBook, editBook } from '../controllers/bookController.js'
import { protectRoute } from '../middlewares/protectRoute.js' // Assuming you have an auth middleware to protect routes

const router = express.Router()

// Route to add a book
router.post('/add', protectRoute, addBook)

// Route to delete a book
router.delete('/:bookId', protectRoute, deleteBook)

// Route to edit a book
router.put('/:bookId', protectRoute, editBook)

export default router
