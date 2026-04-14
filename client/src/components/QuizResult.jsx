const BADGES = {
  low:  { label: 'Heritage Visitor',   color: '#d97706', bg: '#fef3c7' },
  mid:  { label: 'History Enthusiast', color: '#059669', bg: '#d1fae5' },
  high: { label: 'Cultural Scholar',   color: '#7c3aed', bg: '#ede9fe' },
};

export default function QuizResult({ score, total, onRetry }) {
  const pct   = Math.round((score / total) * 100);
  const tier  = pct < 40 ? 'low' : pct < 70 ? 'mid' : 'high';
  const badge = BADGES[tier];

  return (
    <div style={{ textAlign: 'center', padding: '32px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
      <div style={{ fontSize: '48px', fontWeight: 'bold', color: badge.color }}>{pct}%</div>
      <div style={{ fontSize: '18px', fontWeight: 600, margin: '8px 0' }}>{score} / {total} correct</div>
      <div style={{ display: 'inline-block', margin: '12px 0', padding: '6px 20px', background: badge.bg, color: badge.color, borderRadius: '20px', fontSize: '14px', fontWeight: 500 }}>
        {badge.label}
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
        {pct < 40  && 'Keep exploring — take the virtual tour to learn more!'}
        {pct >= 40 && pct < 70 && 'Great effort! Try the AI guide for deeper knowledge.'}
        {pct >= 70 && 'Outstanding! You are a true heritage enthusiast.'}
      </div>
      <button onClick={onRetry} style={{ marginTop: '20px', padding: '10px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
        Try Again
      </button>
    </div>
  );
}