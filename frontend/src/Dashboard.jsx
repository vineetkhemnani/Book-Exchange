import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        const {data} = await axios.get(
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

  // Logout function
  const handleLogout = () => {
    // Clear authentication tokens or session data
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
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">My Books</h2>
        {books.length > 0 ? (
          <ul>
            {books.map((book) => (
              <li key={book._id} className="mb-4 border-b pb-2">
                <h3 className="text-lg font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">Author: {book.author}</p>
                <p className="text-sm text-gray-600">Genre: {book.genre}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">You have not listed any books yet.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
