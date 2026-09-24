export default function HistorySection({ site }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px' }}>Historical Background</h2>
      <p style={{ lineHeight: '1.7', color: '#444', margin: '0 0 16px' }}>{site.historical_background}</p>
      {site.legends_and_stories && (
        <div style={{ background: '#fffbf0', borderLeft: '4px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#92400e', margin: '0 0 6px' }}>Legend</p>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#555', margin: 0 }}>{site.legends_and_stories}</p>
        </div>
      )}
    </div>
  );
}