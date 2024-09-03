import axios from "axios"
import { useState } from "react"

const DeleteButton = ({books,book,setBooks}) => {
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
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        disabled={isDeleteLoading}
      >
        {!isDeleteLoading ? 'Delete' : 'Deleting...'}
      </button>
    </div>
  )
}
export default DeleteButton