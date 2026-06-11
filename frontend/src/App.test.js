import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sign in heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Game Tracker/i);
  expect(headingElement).toBeInTheDocument();
});