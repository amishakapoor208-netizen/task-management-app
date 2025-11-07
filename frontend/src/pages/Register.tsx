import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '../services/api'
import { useNavigate, Link, Navigate } from 'react-router-dom'

const schema = z.object({ username: z.string().min(3), password: z.string().min(6) })

type FormData = z.infer<typeof schema>

export default function Register() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })
  const navigate = useNavigate()

  // Redirect if already logged in
  if (localStorage.getItem('token')) {
    return <Navigate to="/tasks" replace />
  }

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/api/auth/register', data)
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] animate-fadeIn">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-xl animate-scaleIn">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✨</div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us to start managing your tasks</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Username (min 3 chars)</label>
            <input 
              {...register('username')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Password (min 6 chars)</label>
            <input 
              type="password" 
              {...register('password')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Choose a password"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium shadow-md hover:shadow-lg"
          >
             Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">Login here</a>
        </p>
      </div>
    </div>
  )
}
