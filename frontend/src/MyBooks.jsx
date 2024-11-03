import axios from 'axios'
import EditBookModal from './EditBookModal'
import { useState } from 'react'
import DeleteButton from './DeleteButton'
import { Book as BookIcon, Edit } from 'lucide-react'

const MyBooks = ({ books, setBooks }) => {
  const [editingBook, setEditingBook] = useState(null)

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
              className="bg-white rounded-lg shadow-lg p-6 min-h-[250px] flex flex-col justify-between transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {book.title}
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">by {book.author}</p>
                  <p className="text-sm text-gray-600">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {book.genre}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditBook(book)}
                  className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <DeleteButton books={books} book={book} setBooks={setBooks} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <BookIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            You have not listed any books yet.
          </p>
        </div>
      )}

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
