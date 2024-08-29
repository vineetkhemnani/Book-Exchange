import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const [books, setBooks] = useState([])
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  if (!token) {
    navigate('/login')
    return
  }

  // Fetch the books listed by the user
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/books/mybooks',
          {
            withCredentials: true, // This ensures cookies are sent with the request
          }
        )

        setBooks(data)
      } catch (err) {
        console.error('Error fetching books:', err)
      }
    }

    fetchBooks()
  }, [])

  // Delete a book
  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/books/delete/${bookId}`,
        {
          withCredentials: true,
        }
      )

      // Update the books state to remove the deleted book
      setBooks(books.filter((book) => book._id !== bookId))
    } catch (err) {
      console.error('Error deleting book:', err)
    }
  }

  // Edit a book
  const handleEditBook = (bookId) => {
    navigate(`/edit-book/${bookId}`)
  }

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/users/logout',
        {},
        { withCredentials: true }
      )
    } catch (err) {
      console.log(err)
    }

    localStorage.removeItem('token')
    navigate('/login')
  }

  // Navigate to the Add Book page
  const handleAddBook = () => {
    navigate('/add-book')
  }


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">My Dashboard</h1>
        <div>
          <button
            onClick={handleAddBook}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
          >
            Add Book
          </button>
          <Link to={`/book-discovery`}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
          >
            Find Books
          </Link >
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-6">My Books</h2>
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
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditBook(book._id)}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have not listed any books yet.</p>
      )}
    </div>
  )
}

export default Dashboard
