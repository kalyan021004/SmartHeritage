import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TourPlayer from '../components/tour/TourPlayer';

const mockSite = {
  name: 'Test Temple',
  virtual_tour_links: [{ url: 'https://www.youtube.com/watch?v=abc123', type: 'youtube', label: 'Drone view' }],
  virtual_tour_hotspots: [{ name: 'Main entrance', description: 'The grand entrance.' }],
};

describe('TourPlayer', () => {
  test('renders tab for each tour link', () => {
    render(<TourPlayer site={mockSite} />);
    expect(screen.getByText('Drone view')).toBeInTheDocument();
  });

  test('renders hotspot in narration panel', () => {
    render(<TourPlayer site={mockSite} />);
    expect(screen.getByText('Main entrance')).toBeInTheDocument();
  });
});