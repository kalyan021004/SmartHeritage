import { useState } from 'react';
import { searchSites } from '../api/siteApi';
import CategoryGrid from '../components/CategoryGrid';
import { Link } from 'react-router-dom';

export default function CategoryPage() {
  const [selected, setSelected] = useState(null);
  const [sites, setSites]       = useState([]);
  const [loading, setLoading]   = useState(false);

  const loadCategory = async (cat) => {
    setSelected(cat);
    setLoading(true);
    const data = await searchSites(cat);
    setSites(data.results || []);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px' }}>Browse by Category</h1>
      <CategoryGrid onSelect={loadCategory} />
      {selected && (
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px' }}>
            {selected}s {loading ? '...' : `(${sites.length} found)`}
          </h2>
          {loading ? <p style={{ color: '#9ca3af' }}>Searching...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {sites.map(s => (
                <Link key={s._id} to={`/site/${s.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px', color: '#111' }}>{s.name}</h3>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{s.location?.city}, {s.location?.state}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}