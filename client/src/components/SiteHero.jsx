export default function SiteHero({ site }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {site.category && (
          <span style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>
            {site.category}
          </span>
        )}
        {site.conservation_status && (
          <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>
            {site.conservation_status}
          </span>
        )}
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px' }}>{site.name}</h1>
      {site.also_known_as?.length > 0 && (
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 6px' }}>
          Also known as: {site.also_known_as.join(', ')}
        </p>
      )}
      <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
        {[site.location?.city, site.location?.state, site.location?.country].filter(Boolean).join(', ')}
        {site.dynasty_or_period && <span style={{ color: '#888' }}> · {site.dynasty_or_period}</span>}
      </p>
    </div>
  );
}