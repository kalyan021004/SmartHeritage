import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSiteBySlug } from '../api/siteApi';
import TourPlayer from '../components/tour/TourPlayer';

export default function TourPage() {
  const { slug } = useParams();
  const [site, setSite]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteBySlug(slug).then(setSite).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>;
  if (!site)   return <div style={{ padding: '60px', textAlign: 'center' }}>Site not found.</div>;

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
      <Link to={`/site/${site.slug}`} style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '16px' }}>
        ← Back to {site.name}
      </Link>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px' }}>{site.name}</h1>
      <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 24px' }}>
        Virtual Tour · {site.location?.city}, {site.location?.state}
      </p>
      {site.virtual_tour_links?.length > 0
        ? <TourPlayer site={site} />
        : <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#6b7280' }}>No virtual tour links for this site.</div>
      }
    </main>
  );
}