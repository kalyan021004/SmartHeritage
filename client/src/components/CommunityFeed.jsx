import { useState } from 'react';

const SAMPLE = [
  { id: 1, author: 'Priya M.', initials: 'PM', site: 'Brihadeeswarar Temple', date: '3 days ago', story: 'Visited during Karthigai Deepam — the lamps lit around the temple at dusk were breathtaking. The priests explained this tradition dates back to Raja Raja Chola himself.' },
  { id: 2, author: 'Arjun K.', initials: 'AK', site: 'Hampi', date: '1 week ago', story: 'The musical pillars at Vittala Temple actually work! Tap them gently and you hear distinct Carnatic notes. A guard said each pillar represents a different instrument.' },
];

export default function CommunityFeed() {
  const [posts, setPosts] = useState(SAMPLE);
  const [form, setForm]   = useState({ author: '', site: '', story: '' });
  const [ok, setOk]       = useState(false);

  const submit = () => {
    if (!form.author || !form.site || !form.story) return;
    setPosts([{ id: Date.now(), ...form, date: 'Just now', initials: form.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }, ...posts]);
    setForm({ author: '', site: '', story: '' });
    setOk(true);
    setTimeout(() => setOk(false), 3000);
  };

  const inp = { width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' };

  return (
    <div>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>Share your heritage story</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Your name" style={inp} />
          <input value={form.site}   onChange={e => setForm({ ...form, site: e.target.value })}   placeholder="Heritage site you visited" style={inp} />
          <textarea value={form.story} onChange={e => setForm({ ...form, story: e.target.value })} placeholder="Share your experience..." rows={4} style={{ ...inp, resize: 'vertical', lineHeight: '1.6' }} />
          <button onClick={submit} style={{ padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            {ok ? 'Story shared!' : 'Share Story'}
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
                {post.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{post.author}</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{post.date}</span>
                </div>
                <span style={{ display: 'inline-block', fontSize: '12px', color: '#3730a3', background: '#e0e7ff', padding: '2px 8px', borderRadius: '20px', margin: '4px 0 8px' }}>{post.site}</span>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#374151', margin: 0 }}>{post.story}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}