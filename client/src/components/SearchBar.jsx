import { useState, useRef } from 'react';
import { searchSites } from '../api/siteApi';

export default function SearchBar({ onSelect, onNotFound }) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const debounce = useRef(null);

  const handleInput = (val) => {
    setQuery(val);
    clearTimeout(debounce.current);
    if (val.length < 2) { setResults([]); setDropdown(false); return; }
    debounce.current = setTimeout(async () => {
      const data = await searchSites(val);
      setResults(data.results || []);
      setDropdown(true);
    }, 300);
  };
 

  const handleExplore = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setDropdown(false);
    if (results.length > 0) onSelect(results[0]);
    else await onNotFound(query);
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
      <input
        value={query}
        onChange={e => handleInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleExplore()}
        placeholder="Enter place (e.g., Tirupati Temple)"
        style={{
          width: '90vh', padding: '12px 16px', fontSize: '15px',
          border: '1px solid #ccc', borderRadius: '8px', outline: 'none',
        }}
      />

      {dropdown && results.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#343232', border: '1px solid #ddd', borderRadius: '8px',
          marginTop: '4px', padding: 0, listStyle: 'none',
          zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {results.map(r => (
            <li key={r._id}
              onClick={() => { onSelect(r); setDropdown(false); }}
              style={{
                padding: '10px 16px', cursor: 'pointer', fontSize: '14px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex', justifyContent: 'space-between',
              }}>
              <span style={{ fontWeight: 500 }}>{r.name}</span>
              <span style={{ color: '#999', fontSize: '13px' }}>
                {r.location?.city}, {r.location?.state}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleExplore} disabled={loading} style={{
        marginTop: '12px', width: '90vh', padding: '16px 38px',
        background: loading ? '#000' : '#2563eb', color: '#fff',
        border: 'none',cursor: 'pointer', borderRadius: '8px', fontSize: '16px', fontWeight: 600,
      }}>
        {loading ? 'Generating with AI...' : 'Explore'}
      </button>
    </div>
  );
}
 