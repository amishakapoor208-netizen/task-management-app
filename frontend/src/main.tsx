import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
function AppShell({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('token'))
  
  // Update login state when storage changes
  React.useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('token'))
    }
    window.addEventListener('storage', checkAuth)
    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkAuth, 100)
    return () => {
      window.removeEventListener('storage', checkAuth)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.href = '/login'
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md animate-slideIn">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <span>Task Manager</span>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <a className="text-sm text-gray-700 hover:text-blue-600 font-medium" href="/tasks">📝 My Tasks</a>
                <button 
                  onClick={handleLogout} 
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                >
                  👋 Logout
                </button>
              </>
            ) : (
              <>
                <a className="text-sm text-blue-600 hover:text-blue-800 font-medium" href="/login">🔐 Login</a>
                <a className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md" href="/register">✨ Register</a>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
            <Route path="/" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
