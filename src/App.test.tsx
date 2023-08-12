import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders UI', () => {
  render(<App />);
  const linkElement = screen.getByText(/Your Stars:/i);
  expect(linkElement).toBeInTheDocument();
});
