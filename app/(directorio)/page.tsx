import MapaDirectorio from "@/components/directorio/MapaDirectorio";
import { buscarEstablecimientos } from "@/lib/directorio-actions";

export const dynamic = "force-dynamic";

type SearchParams = {
  lat?: string;
  lng?: string;
  radio?: string;
  ciudad?: string;
  servicio?: string;
  texto?: string;
};

export default async function DirectorioPage({ searchParams }: { searchParams: SearchParams }) {
  const lat = searchParams.lat ? parseFloat(searchParams.lat) : -25.3;
  const lng = searchParams.lng ? parseFloat(searchParams.lng) : -57.6;
  const radio = searchParams.radio ? parseFloat(searchParams.radio) : 10;

  const result = await buscarEstablecimientos({ lat, lng, radio_km: radio, ciudad: searchParams.ciudad, servicio: searchParams.servicio, texto: searchParams.texto });
  const establecimientos = result.data ?? [];

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Directorio de lubricentros</h1>
      <form method="get" className="mb-4 flex gap-2 flex-wrap">
        <input name="texto" placeholder="Buscar por nombre" className="border rounded px-2 py-1" defaultValue={searchParams.texto ?? ""} />
        <input name="ciudad" placeholder="Ciudad" className="border rounded px-2 py-1" defaultValue={searchParams.ciudad ?? ""} />
        <input name="servicio" placeholder="Servicio" className="border rounded px-2 py-1" defaultValue={searchParams.servicio ?? ""} />
        <input type="hidden" name="lat" value={lat} />
        <input type="hidden" name="lng" value={lng} />
        <input type="hidden" name="radio" value={radio} />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Buscar</button>
      </form>
      <div className="mb-4">
        <MapaDirectorio establecimientos={establecimientos} centro={{ lat, lng }} />
      </div>
      <p className="text-sm text-gray-600">{establecimientos.length} establecimientos encontrados.</p>
    </main>
  );
}