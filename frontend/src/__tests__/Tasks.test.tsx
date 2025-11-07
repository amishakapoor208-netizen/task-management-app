import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../store/tasksSlice';
import Tasks from '../pages/Tasks';

const mockStore = configureStore({
  reducer: {
    tasks: tasksReducer
  }
});

const renderTasks = () => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    </Provider>
  );
};

describe('Tasks Component', () => {
  it('renders task form', () => {
    renderTasks();
    expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
  });

  it('renders no tasks message initially', () => {
    renderTasks();
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });
});
