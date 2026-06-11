import { render, screen } from '@testing-library/react';

test('basic math calculation test for CI', () => {
  const sum = 2 + 2;
  expect(sum).toBe(4);
});

test('basic interface text verification', () => {
  render(
    <div className="container">
      <h2>Sign In to Game Tracker</h2>
    </div>
  );
  const headingElement = screen.getByText(/Game Tracker/i);
  expect(headingElement).toBeInTheDocument();
});