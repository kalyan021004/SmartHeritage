export default function QuizCard({ question, answer, submitted, onAnswer }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <span style={{
          fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
          background: question.difficulty === 'hard' ? '#fee2e2' : question.difficulty === 'medium' ? '#fef3c7' : '#d1fae5',
          color:      question.difficulty === 'hard' ? '#991b1b' : question.difficulty === 'medium' ? '#92400e' : '#065f46',
        }}>
          {question.difficulty}
        </span>
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{question.category}</span>
      </div>
      <p style={{ fontWeight: 500, fontSize: '15px', margin: '0 0 14px', lineHeight: '1.5' }}>{question.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {question.options?.map(opt => {
          const chosen  = answer === opt;
          const correct = submitted && opt === question.correct;
          const wrong   = submitted && chosen && opt !== question.correct;
          return (
            <button key={opt} onClick={() => !submitted && onAnswer(question.id, opt)} style={{
              textAlign: 'left', padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
              cursor: submitted ? 'default' : 'pointer', border: '1px solid',
              borderColor: correct ? '#86efac' : wrong ? '#fca5a5' : chosen ? '#93c5fd' : '#e5e7eb',
              background:  correct ? '#f0fdf4' : wrong ? '#fef2f2' : chosen ? '#eff6ff' : '#fff',
              color:       correct ? '#166534' : wrong ? '#991b1b' : '#111',
            }}>
              {opt}
            </button>
          );
        })}
      </div>
      {submitted && question.explanation && (
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px', background: '#f9fafb', padding: '10px 12px', borderRadius: '8px' }}>
          {question.explanation}
        </p>
      )}
    </div>
  );
}