

import { useEffect, useState } from 'react';
import { getAllSites } from '../api/siteApi';
import ExploreMap from '../components/ExploreMap';

export default function ExplorePage() {
  const [sites, setSites] = useState([]);

  useEffect(() => { getAllSites().then(setSites); }, []);

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px' }}>Explore Heritage Sites</h1>
      <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px' }}>{sites.length} sites on map</p>
      <ExploreMap sites={sites} />
    </main>
  );
}