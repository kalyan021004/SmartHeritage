export default function CultureSection({ site }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px' }}>Cultural Significance</h2>
      <p style={{ lineHeight: '1.7', color: '#444', margin: 0 }}>{site.cultural_significance}</p>
    </div>
  );
}