import axios from 'axios'
import EditBookModal from './EditBookModal'
import { useState } from 'react'

const MyBooks = ({ books,setBooks }) => {
  const [editingBook, setEditingBook] = useState(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  // Delete a book
  const handleDeleteBook = async (bookId) => {
    setIsDeleteLoading(true)
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/books/delete/${bookId}`,
        {
          withCredentials: true,
        }
      )

      // Update the books state to remove the deleted book
      setBooks(books.filter((book) => book._id !== bookId))
    } catch (err) {
      console.error('Error deleting book:', err)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  // Edit a book
  const handleEditBook = (book) => {
    setEditingBook(book)
  }

  const handleCloseEditModal = () => {
    setEditingBook(null)
  }

  const handleSaveEdit = async (bookId, editedBook) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/books/${bookId}`,
        editedBook,
        {
          withCredentials: true,
        }
      )

      setBooks(
        books.map((book) =>
          book._id === bookId ? { ...book, ...editedBook } : book
        )
      )
      setEditingBook(null)
    } catch (err) {
      console.error('Error updating book:', err)
    }
  }
  return (
    <div>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-lg p-4 h-auto flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-700">Author: {book.author}</p>
                <p className="text-sm text-gray-500">Genre: {book.genre}</p>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditBook(book)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={isDeleteLoading}
                >
                  {!isDeleteLoading ? 'Delete' : 'Deleting...'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have not listed any books yet.</p>
      )}

      {/* editing book */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          isOpen={!!editingBook}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
export default MyBooks
