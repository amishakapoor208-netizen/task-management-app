import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/tasksSlice'
import type { RootState, AppDispatch } from '../store'

export default function Tasks() {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, loading } = useSelector((state: RootState) => state.tasks)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await dispatch(createTask({ title, description, status: 'pending' }))
    setTitle('')
    setDescription('')
  }

  const handleToggle = (task: any) => {
    dispatch(updateTask({
      id: task.id,
      data: { status: task.status === 'pending' ? 'completed' : 'pending' }
    }))
  }

  const handleDelete = (taskTitle: string, id: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${taskTitle}"?\n\nThis action cannot be undone.`
    )
    if (!confirmed) return
    dispatch(deleteTask(id))
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Task</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
          >
            ✨ Add Task
          </button>
        </form>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 animate-fadeIn">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-lg">No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((t, index) => (
              <li 
                key={t.id} 
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-between items-center animate-slideIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex-1">
                  <div className={`font-bold text-lg ${t.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {t.status === 'completed' ? '✅ ' : '⭐ '}
                    {t.title}
                  </div>
                  {t.description && (
                    <div className="text-sm text-gray-600 mt-1">{t.description}</div>
                  )}
                </div>
                <div className="flex gap-2 items-center ml-4">
                  <button 
                    onClick={() => handleToggle(t)} 
                    className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 ${
                      t.status === 'completed' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    {t.status === 'completed' ? 'Completed' : 'Pending'}
                  </button>
                  <button 
                    onClick={() => handleDelete(t.title, t.id)} 
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
