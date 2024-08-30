import { useState } from 'react'
import axios from 'axios'

const AddBookModal = ({ isOpen, onClose, onBookAdded, existingBooks }) => {
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '' })
  const [error, setError] = useState('')
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Book</h2>
        {/* Display error message */}
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700"
            >
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={newBook.genre}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal
