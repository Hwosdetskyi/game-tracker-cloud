import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch
global.fetch = jest.fn();

describe('App Component - Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });

  test('renders login form when not authenticated', () => {
    render(<App />);
    expect(screen.getByText('Sign In to Game Tracker')).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
  });

  test('shows register toggle button', () => {
    render(<App />);
    const toggleBtn = screen.getByText(/Don't have an account/i);
    expect(toggleBtn).toBeInTheDocument();
  });

  test('toggles between login and register forms', () => {
    render(<App />);
    const toggleBtn = screen.getByText(/Don't have an account/i);
    
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Sign In to Game Tracker')).toBeInTheDocument();
  });

  test('handles login submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userId: 1, username: 'testuser', message: 'Login successful' })
    });

    render(<App />);
    
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    await waitFor(() => {
      expect(localStorage.getItem('game_user')).toBeTruthy();
    });
  });

  test('shows error on failed login', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid username or password' })
    });

    render(<App />);
    
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });
});

describe('App Component - Games CRUD', () => {
  beforeEach(() => {
    localStorage.setItem('game_user', JSON.stringify({ userId: 1, username: 'testuser' }));
    fetch.mockClear();
  });

  test('displays dashboard when authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome, testuser!/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays games', async () => {
    const mockGames = [
      { id: 1, title: 'The Witcher 3', platform: 'PC', genre: 'RPG', status: 'Completed', rating: 9 },
      { id: 2, title: 'Elden Ring', platform: 'PS5', genre: 'Action', status: 'In progress', rating: 8 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('The Witcher 3')).toBeInTheDocument();
      expect(screen.getByText('Elden Ring')).toBeInTheDocument();
    });
  });

  test('logs out user and clears data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome, testuser!/i)).toBeInTheDocument();
    });

    const logoutBtn = screen.getByRole('button', { name: /Log Out/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(localStorage.getItem('game_user')).toBeNull();
      expect(screen.getByText('Sign In to Game Tracker')).toBeInTheDocument();
    });
  });
});