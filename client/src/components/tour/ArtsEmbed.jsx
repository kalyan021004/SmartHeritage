export default function ArtsEmbed({ url }) {
  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <iframe src={url} style={{ width: '100%', height: '480px', border: 'none', display: 'block' }}
        allowFullScreen title="Google Arts & Culture Tour" />
      <div style={{ padding: '8px 16px', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
        <span>Powered by Google Arts & Culture</span>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Open full experience</a>
      </div>
    </div>
  );
}