import { useState } from 'react';
import { generateTrail } from '../api/trailApi';

export default function TrailPlanner() {
  const [form, setForm]   = useState({ start_place: '', duration: '1-day', interest: 'General tourist', transport: 'Car' });
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!form.start_place.trim()) return;
    setLoading(true);
    setTrail(null);
    const data = await generateTrail(form);
    setTrail(data);
    setLoading(false);
  };

  const inp = { width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' };

  return (
    <div>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Starting place</label>
          <input value={form.start_place} onChange={e => setForm({ ...form, start_place: e.target.value })} placeholder="e.g., Chennai, Jaipur" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Duration</label>
          <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inp}>
            <option>1-day</option><option>2-day</option><option>Weekend</option><option>3-day</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Transport</label>
          <select value={form.transport} onChange={e => setForm({ ...form, transport: e.target.value })} style={inp}>
            <option>Car</option><option>Public transport</option><option>Walking only</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Interest</label>
          <select value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} style={inp}>
            <option>General tourist</option><option>History enthusiast</option><option>Architecture student</option><option>Family with children</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button onClick={generate} disabled={loading} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'AI is planning your trail...' : 'Generate Heritage Trail'}
          </button>
        </div>
      </div>

      {trail && (
        <div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#1e40af' }}>{trail.theme}</h2>
            <p style={{ fontSize: '14px', color: '#3b82f6', margin: '0 0 8px' }}>{trail.opening_hook}</p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#1d4ed8' }}>
              <span>{trail.total_distance}</span><span>{trail.total_sites} sites</span>
            </div>
          </div>
          {trail.stops?.map(stop => (
            <div key={stop.stop_number} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, flexShrink: 0 }}>
                {stop.stop_number}
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>{stop.site_name}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px' }}>{stop.distance_from_previous} · {stop.travel_time} · {stop.recommended_duration}</p>
                <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 4px' }}>{stop.why_visit}</p>
                <p style={{ fontSize: '13px', color: '#059669', margin: '0 0 4px' }}>Must see: {stop.must_see}</p>
                {stop.food_nearby && <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Food: {stop.food_nearby}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}