export function detectTourType(url) {
  if (!url) return 'unknown';
  if (url.includes('google.com/maps') || url.includes('maps.app.goo.gl')) return 'maps';
  if (url.includes('artsandculture.google.com') || url.includes('g.co/arts')) return 'arts';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'unknown';
}

export function getYoutubeEmbedUrl(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : url;
}