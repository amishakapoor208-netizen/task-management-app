import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/tasks" className="text-2xl font-bold">TaskApp</Link>
        <div className="space-x-4">
          {token ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
