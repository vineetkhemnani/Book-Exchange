import { useEffect, useState, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AddBookModal from './AddBookModal'
// import MyBooks from './MyBooks'

const MyBooks = lazy(() => import('./MyBooks'))

const Dashboard = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true) // Add loading state
  const [isLoggingOut, setIsLoggingOut] = useState(false) // Add logging out state

  // add book modal state
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
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
          `${import.meta.env.VITE_API_URL}/api/books/mybooks`,
          {
            withCredentials: true, // This ensures cookies are sent with the request
          }
        )

        setBooks(data)
      } catch (err) {
        console.error('Error fetching books:', err)
      }finally{
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Logout function
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      )
    } catch (err) {
      console.log(err)
    }finally{
      setIsLoggingOut(false)
    }

    localStorage.removeItem('token')
    navigate('/login')
  }

  // handling add book
  const handleAddBook = () => {
    setIsAddBookModalOpen(true)
  }

  const handleBookAdded = (newBook) => {
    setBooks([...books, newBook])
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
          <Link
            to={`/recommended`}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 mr-2"
          >
            Recommended Books
          </Link>
          <Link
            to={`/book-discovery`}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
          >
            Find Books
          </Link>
          <Link
            to={`/exchange-requests`}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
          >
            Exchange Requests
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out' : 'Logout'}
          </button>
        </div>
      </div>
      <h3 className="text-xl font-bold text-blue-800 text-left">
        Logged in as: {token}
      </h3>

      <h2 className="text-xl font-semibold text-gray-700 mb-6">My Books</h2>

      <Suspense fallback={<p>Loading...</p>}>
        {isLoading ? (
          <p>Loading books...</p>
        ) : (
          <MyBooks books={books} setBooks={setBooks} />
        )}
      </Suspense>

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onBookAdded={handleBookAdded}
        existingBooks={books}
      />
    </div>
  )
}

export default Dashboard
