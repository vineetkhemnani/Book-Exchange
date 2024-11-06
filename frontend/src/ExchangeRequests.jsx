import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ExchangeRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState([])

  // Fetch incoming requests
  useEffect(() => {
    const getIncomingRequests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exchange/incoming`,
          {
            withCredentials: true, // Send cookies with the request
          }
        )
        const requests = await response.data.requests
        // console.log(response.data.requests)
        const filteredRequests = requests.filter((req) => {
          return req.status == 'pending'
        })
        // console.log(filteredRequests)
        setIncomingRequests(filteredRequests)
      } catch (error) {
        console.log('Error fetching incoming requests:', error)
      }
    }

    getIncomingRequests()
  }, [])

  // Handle accepting a request
  const handleAccept = async (requestId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/exchange/${requestId}`,
        { action: 'accept' },
        { withCredentials: true }
      )
      setIncomingRequests(
        incomingRequests.filter((request) => request._id !== requestId)
      )
      alert('Request accepted!')
    } catch (error) {
      console.log('Error accepting the request:', error)
    }
  }

  // Handle rejecting a request
  const handleReject = async (requestId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/exchange/${requestId}`,
        { action: 'reject' },
        { withCredentials: true }
      )
      setIncomingRequests(
        incomingRequests.filter((request) => request._id !== requestId)
      )
      alert('Request rejected!')
    } catch (error) {
      console.log('Error rejecting the request:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between mb-10 items-center">
        <h2 className="md:text-2xl font-bold text-gray-800 text-xl">
          Incoming Exchange Requests
        </h2>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>

      {incomingRequests.length > 0 ? (
        <div className="space-y-4">
          {incomingRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-lg p-4"
            >
              <p>
                <strong>{request.requestedBy.username}</strong> {` `} wants to
                exchange {` `}
                <strong>{request.bookRequested.title}</strong>
                {` `} with you.
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={() => handleAccept(request._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-20 font-bold text-2xl">
          No incoming exchange requests.
        </p>
      )}
    </div>
  )
}

export default ExchangeRequests
