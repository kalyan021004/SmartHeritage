export default function VisitorInfo({ site }) {
  const info = site.visitor_info;
  if (!info) return null;
  const rows = [
    { label: 'Timings', value: info.timings },
    { label: 'Entry fee', value: info.entry_fee },
    { label: 'Best time', value: info.best_time_to_visit },
    { label: 'How to reach', value: info.how_to_reach },
    { label: 'Accessibility', value: info.accessibility },
  ].filter(r => r.value);

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px' }}>Visitor Info</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <tbody>
          {rows.map(r => (
            <tr key={r.label} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '8px 0', color: '#888', width: '120px', verticalAlign: 'top' }}>{r.label}</td>
              <td style={{ padding: '8px 0', color: '#333', lineHeight: '1.6' }}>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {site.nearby_sites?.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', margin: '0 0 8px' }}>Nearby Heritage Sites</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {site.nearby_sites.map(s => (
              <span key={s} style={{ background: '#f3f4f6', color: '#374151', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}