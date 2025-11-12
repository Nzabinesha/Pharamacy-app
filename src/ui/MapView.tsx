import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leafletFix';

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  const bounds = useMemo(() => {
    if (!markers.length) return null;
    const latLngs = markers.map(m => [m.lat, m.lng] as [number, number]);
    return latLngs.length === 1 ? null : L.latLngBounds(latLngs);
  }, [markers]);
  useEffect(() => {
    if (!markers.length) return;
    if (bounds) {
      map.fitBounds(bounds, { padding: [24, 24] });
    } else {
      map.setView([markers[0].lat, markers[0].lng], 14);
    }
  }, [bounds, map, markers]);
  return null;
}

export function MapView({ markers, height = 320 }: { markers: MapMarker[]; height?: number }) {
  const center = markers.length ? [markers[0].lat, markers[0].lng] : [-1.9441, 30.0619]; // Kigali default
  return (
    <div className="w-full overflow-hidden rounded border" style={{ height }}>
      <MapContainer center={center as any} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} />
        {markers.map(m => (
          <Marker key={m.id} position={[m.lat, m.lng] as any}>
            <Popup>{m.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


