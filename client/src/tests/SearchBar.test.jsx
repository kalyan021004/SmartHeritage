import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  test('renders input and button', () => {
    render(<SearchBar onSelect={vi.fn()} onNotFound={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Enter place/i)).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });

  test('button shows loading state', async () => {
    const onNotFound = vi.fn(() => new Promise(r => setTimeout(r, 100)));
    render(<SearchBar onSelect={vi.fn()} onNotFound={onNotFound} />);
    const input = screen.getByPlaceholderText(/Enter place/i);
    fireEvent.change(input, { target: { value: 'TestPlace' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(await screen.findByText(/Generating/i)).toBeInTheDocument();
  });
});