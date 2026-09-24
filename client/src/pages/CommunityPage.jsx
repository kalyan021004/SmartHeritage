import CommunityFeed from '../components/CommunityFeed';

export default function CommunityPage() {
  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px' }}>Community Stories</h1>
      <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px' }}>Real stories from heritage visitors.</p>
      <CommunityFeed />
    </main>
  );
}