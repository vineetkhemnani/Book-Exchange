import axios from 'axios'
import { useState } from 'react'
import { Delete, DeleteIcon, Loader2 } from 'lucide-react'

const DeleteButton = ({ books, book, setBooks }) => {
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

  return (
    <div>
      <button
        onClick={() => handleDeleteBook(book._id)}
        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
        disabled={isDeleteLoading}
      >
        {!isDeleteLoading ? (
          <Delete className="w-4 h-4 mr-2" />
        ) : (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        )}
        {!isDeleteLoading ? 'Delete' : 'Deleting...'}
      </button>
    </div>
  )
}
export default DeleteButton
