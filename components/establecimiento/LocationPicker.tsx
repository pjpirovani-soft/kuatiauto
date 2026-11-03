'use client';

import { useEffect, useRef } from 'react';

type Props = {
  lat: number | null;
  lng: number | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  defaultCenter?: { lat: number; lng: number };
  height?: number;
};

export default function LocationPicker({
  lat,
  lng,
  onChange,
  defaultCenter = { lat: -27.33, lng: -55.87 },
  height = 320,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    let L: any;
    import('leaflet').then((mod) => {
      L = mod.default ?? mod;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const center = lat && lng ? { lat, lng } : defaultCenter;
      const map = L.map(ref.current!).setView([center.lat, center.lng], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      if (lat && lng) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          onChange({ lat: pos.lat, lng: pos.lng });
        });
      }

      map.on('click', (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLng]);
        } else {
          markerRef.current = L.marker([clickLat, clickLng], { draggable: true }).addTo(map);
          markerRef.current.on('dragend', (ev: any) => {
            const pos = ev.target.getLatLng();
            onChange({ lat: pos.lat, lng: pos.lng });
          });
        }
        onChange({ lat: clickLat, lng: clickLng });
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div
        ref={ref}
        style={{ height, width: '100%', borderRadius: 8, border: '1px solid #e5e7eb' }}
      />
      <p className="text-xs text-kuati-grafito/60 mt-2">
        Hacé click en el mapa para marcar la ubicación exacta de tu establecimiento. Podés arrastrar el pin para ajustar.
      </p>
    </div>
  );
}
