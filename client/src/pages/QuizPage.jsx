import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSiteBySlug } from '../api/siteApi';
import { generateQuiz } from '../api/quizApi';
import QuizCard   from '../components/QuizCard';
import QuizResult from '../components/QuizResult';

export default function QuizPage() {
  const { slug } = useParams();
  const [site, setSite]         = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(true);

  const load = async (s) => {
    setLoading(true);
    setAnswers({});
    setSubmitted(false);
    const { questions: qs } = await generateQuiz(s.name, s);
    setQuestions(qs);
    setLoading(false);
  };

  useEffect(() => {
    getSiteBySlug(slug).then(s => { setSite(s); load(s); });
  }, [slug]);

  const score = submitted
    ? questions.reduce((a, q) => answers[q.id] === q.correct ? a + 1 : a, 0)
    : 0;

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Generating quiz with AI...</div>;

  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 16px' }}>
      <Link to={`/site/${slug}`} style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '16px' }}>← Back to site</Link>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 24px' }}>{site?.name} — Quiz</h1>

      {!submitted ? (
        <>
          {questions.map(q => (
            <QuizCard key={q.id} question={q} answer={answers[q.id]} submitted={false}
              onAnswer={(id, opt) => setAnswers(a => ({ ...a, [id]: opt }))} />
          ))}
          <button onClick={() => setSubmitted(true)} style={{ width: '100%', padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
            Submit Answers
          </button>
        </>
      ) : (
        <>
          {questions.map(q => (
            <QuizCard key={q.id} question={q} answer={answers[q.id]} submitted={true} onAnswer={() => {}} />
          ))}
          <QuizResult score={score} total={questions.length} onRetry={() => load(site)} />
        </>
      )}
    </main>
  );
}