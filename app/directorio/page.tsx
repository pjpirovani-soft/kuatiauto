import MapaDirectorio from "@/components/directorio/MapaDirectorio";
import MiUbicacionButton from "@/components/directorio/MiUbicacionButton";
import { buscarEstablecimientos } from "@/lib/directorio-actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = {
  lat?: string;
  lng?: string;
  radio?: string;
  ciudad?: string;
  servicio?: string;
  texto?: string;
};

const CIUDADES_PARAGUAY = [
  "Asunción", "Encarnación", "Ciudad del Este", "San Lorenzo", "Luque",
  "Capiatá", "Lambaré", "Fernando de la Mora", "Limpio", "Ñemby",
  "Mariano Roque Alonso", "Villa Elisa", "San Antonio", "Coronel Oviedo",
  "Pedro Juan Caballero", "Concepción", "Villarrica", "Caaguazú", "Paraguarí",
  "Pilar", "Caacupé", "Itauguá", "Hernandarias", "Presidente Franco",
];

// H-DIR-1: coordenadas para centrar el mapa cuando se filtra por ciudad.
const CIUDADES_COORDS: Record<string, { lat: number; lng: number }> = {
  "Asunción": { lat: -25.2637, lng: -57.5759 },
  "Encarnación": { lat: -27.3306, lng: -55.8650 },
  "Ciudad del Este": { lat: -25.5097, lng: -54.6111 },
  "San Lorenzo": { lat: -25.3397, lng: -57.5089 },
  "Luque": { lat: -25.2667, lng: -57.4833 },
  "Capiatá": { lat: -25.3500, lng: -57.4333 },
  "Lambaré": { lat: -25.3467, lng: -57.6061 },
  "Fernando de la Mora": { lat: -25.3167, lng: -57.5500 },
  "Limpio": { lat: -25.1667, lng: -57.4833 },
  "Ñemby": { lat: -25.3833, lng: -57.5333 },
  "Mariano Roque Alonso": { lat: -25.2167, lng: -57.5500 },
  "Villa Elisa": { lat: -25.3667, lng: -57.5833 },
  "San Antonio": { lat: -25.3833, lng: -57.6167 },
  "Coronel Oviedo": { lat: -25.4500, lng: -56.4500 },
  "Pedro Juan Caballero": { lat: -22.5500, lng: -55.7333 },
  "Concepción": { lat: -23.4000, lng: -57.4333 },
  "Villarrica": { lat: -25.7500, lng: -56.4333 },
  "Caaguazú": { lat: -25.4667, lng: -56.0167 },
  "Paraguarí": { lat: -25.6333, lng: -57.1500 },
  "Pilar": { lat: -26.8500, lng: -58.3000 },
  "Caacupé": { lat: -25.3833, lng: -57.1333 },
  "Itauguá": { lat: -25.3833, lng: -57.3333 },
  "Hernandarias": { lat: -25.4000, lng: -54.6333 },
  "Presidente Franco": { lat: -25.5333, lng: -54.6167 },
};

export default async function DirectorioPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;

  // H-DIR-1: si hay ciudad seleccionada, centrar el mapa en esa ciudad.
  // Si no, usar lat/lng (Mi ubicacion o default). La ciudad tiene prioridad
  // sobre lat/lng para que el mapa siga al filtro.
  const centroCiudad = sp.ciudad ? CIUDADES_COORDS[sp.ciudad] : null;
  const lat = centroCiudad?.lat ?? (sp.lat ? parseFloat(sp.lat) : -27.33);
  const lng = centroCiudad?.lng ?? (sp.lng ? parseFloat(sp.lng) : -55.87);
  const radio = sp.radio ? parseFloat(sp.radio) : 50;

  const result = await buscarEstablecimientos({
    lat,
    lng,
    radio_km: radio,
    ciudad: sp.ciudad,
    servicio: sp.servicio,
    texto: sp.texto,
  });
  const establecimientos = result.data ?? [];

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Directorio de lubricentros</h1>
      <form method="get" className="mb-4 flex gap-2 flex-wrap">
        <input name="texto" placeholder="Buscar por nombre" className="border rounded px-2 py-1" defaultValue={sp.texto ?? ""} />
        <select name="ciudad" className="border rounded px-2 py-1" defaultValue={sp.ciudad ?? ""}>
          <option value="">Todas las ciudades</option>
          {CIUDADES_PARAGUAY.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input name="servicio" placeholder="Servicio" className="border rounded px-2 py-1" defaultValue={sp.servicio ?? ""} />
        <input type="hidden" name="lat" value={lat} />
        <input type="hidden" name="lng" value={lng} />
        <input type="hidden" name="radio" value={radio} />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Buscar</button>
        <MiUbicacionButton />
      </form>
      <div className="mb-4">
        <MapaDirectorio establecimientos={establecimientos} centro={{ lat, lng }} />
      </div>
      <p className="text-sm text-gray-600">{establecimientos.length} establecimientos encontrados.</p>
    </main>
  );
}