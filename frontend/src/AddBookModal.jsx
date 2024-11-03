import { useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'

const AddBookModal = ({ isOpen, onClose, onBookAdded, existingBooks }) => {
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // edge case to check if the book already exists
    const duplicate = existingBooks.find(
      (book) =>
        book.title.toLowerCase() === newBook.title.toLowerCase() &&
        book.author.toLowerCase() === newBook.author.toLowerCase()
    )
    if (duplicate) {
      setError('A book with this title and author already exists.')
      return
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/books/add`,
        newBook,
        { withCredentials: true }
      )
      onBookAdded(response.data)
      setNewBook({ title: '', author: '', genre: '' })
      onClose()
    } catch (error) {
      console.error('Error adding book:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Book
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={newBook.genre}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal
