import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.0/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.0/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.0/dist/images/marker-shadow.png',
});

export default function ExploreMap({ sites }) {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5}
      style={{ width: '100%', height: '500px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors' />
      {sites.map(site =>
        site.location?.lat && site.location?.lng ? (
          <Marker key={site._id} position={[site.location.lat, site.location.lng]}>
            <Popup>
              <strong style={{ display: 'block', marginBottom: '4px' }}>{site.name}</strong>
              <span style={{ fontSize: '12px', color: '#888' }}>{site.location.city}, {site.location.state}</span><br />
              <Link to={`/site/${site.slug}`} style={{ fontSize: '12px', color: '#2563eb', display: 'block', marginTop: '6px' }}>
                View details →
              </Link>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}