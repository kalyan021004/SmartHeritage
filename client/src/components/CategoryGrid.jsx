const CATEGORIES = [
  { name: 'Temple',   emoji: '🛕', color: '#fef3c7', border: '#fcd34d', text: '#92400e' },
  { name: 'Fort',     emoji: '🏰', color: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
  { name: 'Palace',   emoji: '🏛️', color: '#e0e7ff', border: '#a5b4fc', text: '#3730a3' },
  { name: 'Monument', emoji: '🗿', color: '#f3f4f6', border: '#d1d5db', text: '#374151' },
  { name: 'Cave',     emoji: '🪨', color: '#ecfdf5', border: '#6ee7b7', text: '#065f46' },
  { name: 'Ruins',    emoji: '🏚️', color: '#fff7ed', border: '#fdba74', text: '#9a3412' },
  { name: 'Mosque',   emoji: '🕌', color: '#f0fdf4', border: '#86efac', text: '#166534' },
  { name: 'Church',   emoji: '⛪', color: '#eff6ff', border: '#93c5fd', text: '#1e40af' },
];

export default function CategoryGrid({ onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
      {CATEGORIES.map(cat => (
        <button key={cat.name} onClick={() => onSelect(cat.name)} style={{
          padding: '20px 12px', borderRadius: '12px',
          background: cat.color, border: `1px solid ${cat.border}`,
          cursor: 'pointer', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '28px' }}>{cat.emoji}</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: cat.text }}>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}