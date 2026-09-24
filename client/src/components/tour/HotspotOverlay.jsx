export default function HotspotOverlay({ hotspots, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
      {hotspots.map((h, i) => (
        <button key={i} onClick={() => onSelect(h)} style={{
          padding: '6px 12px', fontSize: '12px', fontWeight: 500,
          background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer',
        }}>
          {h.name}
        </button>
      ))}
    </div>
  );
}