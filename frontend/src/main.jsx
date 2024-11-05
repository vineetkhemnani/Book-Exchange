import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Signup from './Signup.jsx'
import Dashboard from './Dashboard.jsx'
import Login from './Login.jsx'
import BookDiscovery from './BookDiscovery.jsx'
import MatchedBooks from './MatchedBooks.jsx'
import ExchangeRequests from './ExchangeRequests.jsx'

// Protected Route wrapper component
const ProtectedRoute = () => {
  const token = localStorage.getItem('token')

  // Redirect to login if no token is found
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Render child routes if authenticated
  return <Outlet />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    // Protected routes group
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/book-discovery',
        element: <BookDiscovery />,
      },
      {
        path: '/recommended',
        element: <MatchedBooks />,
      },
      {
        path: '/exchange-requests',
        element: <ExchangeRequests />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
