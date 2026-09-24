import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';

const site = { name: 'Hampi', dynasty_or_period: 'Vijayanagara', architectural_style: 'Vijayanagara', historical_background: 'Test', cultural_significance: 'Test', legends_and_stories: 'Test', visitor_info: {} };

describe('ChatInterface', () => {
  test('shows greeting message', () => {
    render(<ChatInterface site={site} />);
    expect(screen.getByText(/Namaste/i)).toBeInTheDocument();
  });

  test('renders suggestion chips', () => {
    render(<ChatInterface site={site} />);
    expect(screen.getByText(/history as a story/i)).toBeInTheDocument();
  });
});