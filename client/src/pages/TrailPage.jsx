import TrailPlanner from '../components/TrailPlanner';

export default function TrailPage() {
  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px' }}>Heritage Trail Planner</h1>
      <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px' }}>AI plans your perfect heritage route.</p>
      <TrailPlanner />
    </main>
  );
}