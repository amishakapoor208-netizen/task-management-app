import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import axios from '../services/api';

jest.mock('../services/api');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form', () => {
    renderLogin();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });
    
    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', {
        username: 'testuser',
        password: 'password123'
      });
    });
  });

  it('shows error on login failure', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } }
    });
    
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    
    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
    });
    
    alertMock.mockRestore();
  });
});
