import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SiteDetailPage from '../pages/SiteDetailPage';
import * as siteApi from '../api/siteApi';

describe('SiteDetailPage', () => {
  test('shows loading initially', () => {
    vi.spyOn(siteApi, 'getSiteBySlug').mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter initialEntries={['/site/hampi']}>
        <Routes><Route path="/site/:slug" element={<SiteDetailPage />} /></Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});