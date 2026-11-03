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

export default async function DirectorioPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const lat = sp.lat ? parseFloat(sp.lat) : -27.33;
  const lng = sp.lng ? parseFloat(sp.lng) : -55.87;
  const radio = sp.radio ? parseFloat(sp.radio) : 50;

  const result = await buscarEstablecimientos({
    lat,
    lng,
    radio_km: sp.ciudad ? 1000 : radio,
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