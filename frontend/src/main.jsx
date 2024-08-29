import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Signup from './Signup.jsx'
import Dashboard from './Dashboard.jsx'
import Login from './Login.jsx'
import BookDiscovery from './BookDiscovery.jsx'

const token = localStorage.getItem('token')

const router = createBrowserRouter([
  {
    path: '/',
    element: token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element:  <Login />,
  },
  {
    path: '/dashboard',
    element: token ? <Dashboard /> : <Navigate to="/login" />,
  },
  {
    path: '/book-discovery',
    element: token ? <BookDiscovery /> : <Navigate to="/login" />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
