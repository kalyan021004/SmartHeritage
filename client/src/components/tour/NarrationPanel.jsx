import { useState } from 'react';
import axios from 'axios';

export default function NarrationPanel({ site }) {
  const [selected, setSelected]   = useState(null);
  const [narration, setNarration] = useState('');
  const [loading, setLoading]     = useState(false);
  const hotspots = site.virtual_tour_hotspots || [];

  const getNarration = async (hotspot) => {
    setSelected(hotspot);
    setLoading(true);
    setNarration('');
    const { data } = await axios.post('/api/tour/narrate', {
      site_name: site.name,
      hotspot_name: hotspot.name,
      site_context: {
        dynasty: site.dynasty_or_period,
        style: site.architectural_style,
        built_by: site.built_by,
      },
    });
    setNarration(data.narration);
    setLoading(false);
  };

  return (
    <div style={{ width: '260px', flexShrink: 0 }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '0 0 10px' }}>Tour Hotspots</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {hotspots.map((h, i) => (
          <button key={i} onClick={() => getNarration(h)} style={{
            textAlign: 'left', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid', cursor: 'pointer',
            borderColor: selected?.name === h.name ? '#93c5fd' : '#e5e7eb',
            background: selected?.name === h.name ? '#eff6ff' : '#fff',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>{h.name}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.description}</div>
          </button>
        ))}
      </div>
      {(loading || narration) && (
        <div style={{ marginTop: '12px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '14px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#92400e', margin: '0 0 8px' }}>AI Audio Guide</p>
          {loading
            ? <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Generating...</p>
            : <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#444', margin: 0 }}>{narration}</p>
          }
        </div>
      )}
    </div>
  );
}