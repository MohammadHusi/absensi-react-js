import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SIAM SMK Mawaddah app', () => {
  render(<App />);
  const elements = screen.getAllByText(/Mawaddah/i);
  expect(elements.length).toBeGreaterThan(0);
});
