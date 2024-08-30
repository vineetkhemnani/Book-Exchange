import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ExchangeButton from './ExchangeButton'
import Book from './Book'

const BookDiscovery = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/books/others`,
          { withCredentials: true }
        )
        setBooks(response.data)
        setFilteredBooks(response.data)

        // Extract unique genres from books
        const uniqueGenres = [
          ...new Set(response.data.map((book) => book.genre)),
        ]
        setGenres(uniqueGenres)
      } catch (error) {
        console.error('Error fetching books from other users:', error)
      }
    }

    fetchBooks()
  }, [])

  const handleFilterChange = (genre) => {
    setSelectedGenre(genre)
    if (genre === '') {
      setFilteredBooks(books)
    } else {
      const filtered = books.filter((book) => book.genre === genre)
      setFilteredBooks(filtered)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Books from Other Users
        </h2>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Genre Filter */}
      <div className="mb-6">
        <label className="font-semibold text-gray-700 mr-4">
          Filter by Genre:
        </label>
        <select
          value={selectedGenre}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Book key={book._id} book={book}/>
        ))}
      </div>
    </div>
  )
}

export default BookDiscovery
