import './App.css'
import { Navigate, Outlet } from 'react-router-dom'

function App() {
const token = localStorage.getItem('token')
  return (
    <>
      {token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      {/* <Outlet/> */}
    </>
  )
}

export default App
