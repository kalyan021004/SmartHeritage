export default function GoogleMapsEmbed({ url }) {
  if (url.includes('/maps/embed')) {
    return (
      <iframe src={url} style={{ width: '100%', height: '480px', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'block' }}
        allowFullScreen loading="lazy" title="Google Maps Tour" />
    );
  }
  return (
    <div style={{ width: '100%', height: '480px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ fontSize: '52px' }}>🗺️</div>
      <p style={{ color: '#0369a1', fontWeight: 500, margin: 0 }}>360° Street View available</p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
        Open Virtual Tour
      </a>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Opens in new tab</p>
    </div>
  );
}