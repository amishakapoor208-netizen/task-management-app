import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../services/api'

export interface Task {
  id: string
  title: string
  description?: string
  status: string
  createdAt: string
  updatedAt: string
}

interface TasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get('/api/tasks')
  return response.data
})

export const createTask = createAsyncThunk('tasks/createTask', async (task: { title: string; description?: string; status?: string }) => {
  const response = await axios.post('/api/tasks', task)
  return response.data
})

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }: { id: string; data: Partial<Task> }) => {
  const response = await axios.put(`/api/tasks/${id}`, data)
  return response.data
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  await axios.delete(`/api/tasks/${id}`)
  return id
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch tasks'
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id)
        if (index !== -1) state.tasks[index] = action.payload
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload)
      })
  }
})

export default tasksSlice.reducer
