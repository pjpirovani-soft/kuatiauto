"use client";

import { useEffect, useRef } from "react";

export type EstablecimientoMapa = {
  id: string;
  nombre: string;
  direccion_aproximada: string | null;
  barrio: string | null;
  ciudad: string | null;
  telefono: string | null;
  lat_aproximada: number;
  lng_aproximada: number;
};

type Props = {
  establecimientos: EstablecimientoMapa[];
  centro?: { lat: number; lng: number };
};

export default function MapaDirectorio({ establecimientos, centro }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    let L: any;
    import("leaflet").then((mod) => {
      L = mod.default ?? mod;

      // Importar CSS de Leaflet (una sola vez)
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (mapRef.current) {
        mapRef.current.remove();
      }

      const c = centro ?? { lat: -25.3, lng: -57.6 }; // Asunción por defecto
      const map = L.map(ref.current!).setView([c.lat, c.lng], 12);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      establecimientos.forEach((e) => {
        if (e.lat_aproximada && e.lng_aproximada) {
          const marker = L.marker([e.lat_aproximada, e.lng_aproximada]).addTo(map);
          marker.bindPopup(
            `<strong>${e.nombre}</strong><br/>${e.direccion_aproximada ?? ""}<br/>${e.ciudad ?? ""}<br/>${e.telefono ?? ""}`
          );
        }
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [establecimientos, centro]);

  return <div ref={ref} style={{ height: "500px", width: "100%", borderRadius: "8px" }} />;
}