import React, { useState } from 'react'
import axios from 'axios'

const ExchangeButton = ({ book }) => {
  const [exchangeRequested, setExchangeRequested] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createRequest = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/exchange/createExchange`,
        { bookId: book._id },
        {
          withCredentials: true,
        }
      )
      if (response.status === 200 || response.status === 201) {
        setExchangeRequested(true)
      }
    } catch (error) {
      console.error('Error creating exchange request:', error)
      setError('Failed to create exchange request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!exchangeRequested ? (
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          onClick={createRequest}
          disabled={isLoading}
        >
          {isLoading ? 'Requesting...' : 'Request Exchange'}
        </button>
      ) : (
        <p className="mt-4 text-green-600">Exchange Requested for {book.title}</p>
      )}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </>
  )
}

export default ExchangeButton
