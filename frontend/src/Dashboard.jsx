import { useEffect, useState, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AddBookModal from './AddBookModal'
import {
  Book,
  BookPlus,
  RefreshCw,
  Search,
  LogOut,
  Loader2,
} from 'lucide-react'

// Lazy load MyBooks component
const MyBooks = lazy(() => import('./MyBooks'))

const Dashboard = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const navigate = useNavigate()

  // Move token check to useEffect to avoid React state updates during render
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  // Fetch books data
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/books/mybooks`,
          {
            withCredentials: true,
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

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      )
      localStorage.removeItem('token')
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleAddBook = () => {
    setIsAddBookModalOpen(true)
  }

  const handleBookAdded = (newBook) => {
    setBooks([...books, newBook])
  }

  // Get token for display
  const token = localStorage.getItem('token')

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Welcome back,{' '}
              <span className="font-bold text-blue-700">{token}!</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5 mr-2" />
            )}
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </header>

        <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={handleAddBook}
            className="flex items-center justify-center px-4 py-3 bg-[#FF6F61] hover:bg-[#E66054] text-white rounded-lg transition-colors duration-300"
          >
            <BookPlus className="w-5 h-5 mr-2" />
            Add New Book
          </button>
          <Link
            to="/recommended"
            className="flex items-center justify-center px-4 py-3 bg-[#36C2CF] hover:bg-[#2BA4AD] text-white rounded-lg transition-colors duration-300"
          >
            <Book className="w-5 h-5 mr-2" />
            Recommended Books
          </Link>
          <Link
            to="/book-discovery"
            className="flex items-center justify-center px-4 py-3 bg-[#4A90E2] hover:bg-[#3A75B2] text-white rounded-lg transition-colors duration-300"
          >
            <Search className="w-5 h-5 mr-2" />
            Find Books
          </Link>
          <Link
            to="/exchange-requests"
            className="flex items-center justify-center px-4 py-3 bg-[#29A19C] hover:bg-[#228B85] text-white rounded-lg transition-colors duration-300"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Exchange Requests
          </Link>
        </nav>

        <main className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            My Books
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                </div>
              }
            >
              <MyBooks books={books} setBooks={setBooks} />
            </Suspense>
          )}
        </main>

        <AddBookModal
          isOpen={isAddBookModalOpen}
          onClose={() => setIsAddBookModalOpen(false)}
          onBookAdded={handleBookAdded}
          existingBooks={books}
        />
      </div>
    </div>
  )
}

export default Dashboard
