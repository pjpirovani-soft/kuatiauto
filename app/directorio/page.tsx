import MapaDirectorio from "@/components/directorio/MapaDirectorio";
import MiUbicacionButton from "@/components/directorio/MiUbicacionButton";
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

export default async function DirectorioPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const lat = sp.lat ? parseFloat(sp.lat) : -27.33;
  const lng = sp.lng ? parseFloat(sp.lng) : -55.87;
  const radio = sp.radio ? parseFloat(sp.radio) : 50;

  const result = await buscarEstablecimientos({ lat, lng, radio_km: radio, ciudad: sp.ciudad, servicio: sp.servicio, texto: sp.texto });
  const establecimientos = result.data ?? [];

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Directorio de lubricentros</h1>
      <form method="get" className="mb-4 flex gap-2 flex-wrap">
        <input name="texto" placeholder="Buscar por nombre" className="border rounded px-2 py-1" defaultValue={sp.texto ?? ""} />
        <select name="ciudad" className="border rounded px-2 py-1" defaultValue={sp.ciudad ?? ""}>
          <option value="">Todas las ciudades</option>
          <option value="Asunción">Asunción</option>
          <option value="Encarnación">Encarnación</option>
          <option value="Ciudad del Este">Ciudad del Este</option>
          <option value="San Lorenzo">San Lorenzo</option>
          <option value="Luque">Luque</option>
          <option value="Capiatá">Capiatá</option>
          <option value="Lambaré">Lambaré</option>
          <option value="Fernando de la Mora">Fernando de la Mora</option>
          <option value="Limpio">Limpio</option>
          <option value="Ñemby">Ñemby</option>
          <option value="Mariano Roque Alonso">Mariano Roque Alonso</option>
          <option value="Villa Elisa">Villa Elisa</option>
          <option value="San Antonio">San Antonio</option>
          <option value="Coronel Oviedo">Coronel Oviedo</option>
          <option value="Pedro Juan Caballero">Pedro Juan Caballero</option>
          <option value="Concepción">Concepción</option>
          <option value="Villarrica">Villarrica</option>
          <option value="Caaguazú">Caaguazú</option>
          <option value="Paraguarí">Paraguarí</option>
          <option value="Pilar">Pilar</option>
          <option value="Caacupé">Caacupé</option>
          <option value="Itauguá">Itauguá</option>
          <option value="Hernandarias">Hernandarias</option>
          <option value="Presidente Franco">Presidente Franco</option>
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