import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '../services/api'
import { useNavigate, Link, Navigate } from 'react-router-dom'

const schema = z.object({ username: z.string().min(3), password: z.string().min(6) })

type FormData = z.infer<typeof schema>

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })
  const navigate = useNavigate()

  // Redirect if already logged in
  if (localStorage.getItem('token')) {
    return <Navigate to="/tasks" replace />
  }

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/api/auth/login', data)
      localStorage.setItem('token', res.data.token)
      window.location.href = '/tasks' // Force reload to update AppShell
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] animate-fadeIn">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-xl animate-scaleIn">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to manage your tasks</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Username</label>
            <input 
              {...register('username')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <input 
              type="password" 
              {...register('password')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg"
          >
            🚀 Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">Register here</a>
        </p>
      </div>
    </div>
  )
}
