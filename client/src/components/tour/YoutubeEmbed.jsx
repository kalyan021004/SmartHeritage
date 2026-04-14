import { getYoutubeEmbedUrl } from '../../lib/detectTourType';

export default function YoutubeEmbed({ url }) {
  const embedUrl = getYoutubeEmbedUrl(url);
  return (
    <div style={{ width: '100%', position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <iframe src={embedUrl}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="Heritage Tour" />
    </div>
  );
}