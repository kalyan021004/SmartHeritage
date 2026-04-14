import { useState } from 'react';
import { detectTourType } from '../../lib/detectTourType';
import GoogleMapsEmbed from './GoogleMapsEmbed';
import ArtsEmbed       from './ArtsEmbed';
import YoutubeEmbed    from './YoutubeEmbed';
import NarrationPanel  from './NarrationPanel';

export default function TourPlayer({ site }) {
  const links = site.virtual_tour_links || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const activeLink = links[activeIdx];
  const tourType   = activeLink ? detectTourType(activeLink.url) : 'unknown';

  return (
    <div>
      {links.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {links.map((link, i) => (
            <button key={i} onClick={() => setActiveIdx(i)} style={{
              padding: '7px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid', cursor: 'pointer',
              borderColor: i === activeIdx ? '#2563eb' : '#d1d5db',
              background:  i === activeIdx ? '#2563eb' : '#fff',
              color:       i === activeIdx ? '#fff'    : '#374151',
            }}>
              {link.label || `Tour ${i + 1}`}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          {tourType === 'maps'    && <GoogleMapsEmbed url={activeLink.url} />}
          {tourType === 'arts'    && <ArtsEmbed       url={activeLink.url} />}
          {tourType === 'youtube' && <YoutubeEmbed    url={activeLink.url} />}
          {tourType === 'unknown' && (
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <p>Preview unavailable.</p>
              <a href={activeLink?.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Open in new tab</a>
            </div>
          )}
        </div>
        <NarrationPanel site={site} />
      </div>
    </div>
  );
}