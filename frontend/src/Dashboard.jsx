import { useEffect, useState, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AddBookModal from './AddBookModal'
import { Book, BookPlus, RefreshCw, Search,LogOut } from 'lucide-react'
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
      } finally {
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
    } finally {
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
    <div>
        <h1 className="text-4xl font-bold text-gray-700">My Dashboard</h1>
      <div className="flex justify-between items-center mt-6">

        <div className="grid grid-cols-5 gap-4 mb-8">
          <button
            onClick={handleAddBook}
            className="flex items-center justify-center px-4 py-3 bg-[#FF6F61] hover:bg-[#E66054] text-white rounded-lg transition-colors duration-300"
          >
            <BookPlus className="w-5 h-5 mr-2" />
            Add New Book
          </button>
          <Link
            to={`/recommended`}
            className="flex items-center justify-center px-4 py-3 bg-[#36C2CF] hover:bg-[#2BA4AD] text-white rounded-lg transition-colors duration-300"
          >
            <Book className="w-5 h-5 mr-2" />
            Recommended Books
          </Link>
          <Link
            to={`/book-discovery`}
            className="flex items-center justify-center px-4 py-3 bg-[#4A90E2] hover:bg-[#3A75B2] text-white rounded-lg transition-colors duration-300"
          >
            <Search className="w-5 h-5 mr-2" />
            Find Books
          </Link>
          <Link
            to={`/exchange-requests`}
            className="flex items-center justify-center px-4 py-3 bg-[#29A19C] hover:bg-[#228B85] text-white rounded-lg transition-colors duration-300"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Exchange Requests
          </Link>

          <button
            onClick={handleLogout}
            className={`px-4 py-2 text-white rounded-md flex items-center justify-center ${
              isLoggingOut
                ? 'bg-red-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={isLoggingOut}
          >
            {!isLoggingOut && <LogOut className="w-5 h-5" />}
            <span className={!isLoggingOut ? 'ml-2' : ''}>
              {isLoggingOut ? 'Logging out' : 'Logout'}
            </span>
          </button>
        </div>

        {/* <button
            onClick={handleAddBook}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
          >
            Add Book
          </button> */}
        {/* <Link
            to={`/recommended`}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 mr-2"
          >
            Recommended Books
          </Link> */}
        {/* <Link
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
          </Link> */}
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
