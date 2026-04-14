import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSiteBySlug } from '../api/siteApi';
import ChatInterface from '../components/ChatInterface';

export default function ChatPage() {
  const { slug } = useParams();
  const [site, setSite] = useState(null);

  useEffect(() => { getSiteBySlug(slug).then(setSite); }, [slug]);

  if (!site) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>;

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 16px' }}>
      <Link to={`/site/${site.slug}`} style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '16px' }}>← Back to {site.name}</Link>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px' }}>{site.name} — AI Guide</h1>
      <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 24px' }}>Ask anything about this site.</p>
      <ChatInterface site={site} />
    </main>
  );
}