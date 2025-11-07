import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">TaskApp</Link>
        <nav className="flex items-center gap-3">
          {!token ? (
            <>
              <Link to="/login" className="px-3 py-1 rounded hover:bg-white/10">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded bg-white/10">Register</Link>
            </>
          ) : (
            <>
              <Link to="/tasks" className="px-3 py-1 rounded hover:bg-white/10">My Tasks</Link>
              <button onClick={logout} className="px-3 py-1 rounded bg-white/10">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
