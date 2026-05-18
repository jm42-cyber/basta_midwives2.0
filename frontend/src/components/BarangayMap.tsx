import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Barangay } from '@/types';
import { SANTA_CRUZ_LAGUNA_CENTER, getBarangayCoordinates } from '@/constants/barangayCoordinates';
import { useState } from 'react';

// Fix Leaflet default icon issue with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface BarangayMapProps {
  barangays: Barangay[];
}

// Multiple tile provider options
const TILE_PROVIDERS = [
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c']
  },
  {
    name: 'CartoDB Positron',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: ['a', 'b', 'c', 'd']
  },
  {
    name: 'Esri World Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    subdomains: []
  }
];

export default function BarangayMap({ barangays }: BarangayMapProps) {
  const [tileProviderIndex] = useState(0); // Change index to switch providers: 0=OSM, 1=CartoDB, 2=Esri
  const currentProvider = TILE_PROVIDERS[tileProviderIndex];
  
  // Santa Cruz, Laguna coordinates
  const center: [number, number] = [SANTA_CRUZ_LAGUNA_CENTER.lat, SANTA_CRUZ_LAGUNA_CENTER.lng];
  
  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={true}
      className="h-full w-full rounded-xl z-0"
      style={{ minHeight: '300px', background: '#f8f9fa' }}
    >
      <TileLayer
        attribution={currentProvider.attribution}
        url={currentProvider.url}
        maxZoom={19}
        subdomains={currentProvider.subdomains}
        crossOrigin={true}
      />
      
      {barangays.map((barangay) => {
        // Use database coordinates if available, otherwise use constants as fallback
        let lat = barangay.latitude;
        let lng = barangay.longitude;
        
        if (!lat || !lng) {
          const coords = getBarangayCoordinates(barangay.name);
          if (coords) {
            lat = coords.lat;
            lng = coords.lng;
          } else {
            // Last resort: random position near center
            lat = center[0] + (Math.random() - 0.5) * 0.02;
            lng = center[1] + (Math.random() - 0.5) * 0.02;
          }
        }
        
        return (
          <Marker key={barangay.id} position={[lat, lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg text-gray-900">{barangay.name}</h3>
                {barangay.address && (
                  <p className="text-sm text-gray-600 mb-1">{barangay.address}</p>
                )}
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Population:</span> {barangay.population?.toLocaleString() || 'N/A'}
                  </p>
                  {barangay.barangay_captain && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Captain:</span> {barangay.barangay_captain}
                    </p>
                  )}
                  {barangay.health_officer && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Health Officer:</span> {barangay.health_officer}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
