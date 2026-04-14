export default function ArchSection({ site }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px' }}>Architecture</h2>
      <p style={{ color: '#888', fontSize: '13px', margin: '0 0 14px' }}>
        {[site.architectural_style, site.built_by && `Built by ${site.built_by}`, site.year_built].filter(Boolean).join(' · ')}
      </p>
      <ul style={{ paddingLeft: '20px', margin: 0 }}>
        {site.architectural_highlights?.map((h, i) => (
          <li key={i} style={{ fontSize: '14px', lineHeight: '1.8', color: '#444', marginBottom: '4px' }}>{h}</li>
        ))}
      </ul>
    </div>
  );
}