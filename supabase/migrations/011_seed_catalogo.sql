-- 011_seed_catalogo.sql
-- F5c: seed del catálogo automotriz global.
-- Solo para el piloto. No commitear a producción sin verificación.
-- Los datos marcados [PENDIENTE] requieren verificación antes de usar en producción.
-- Regla: no inventar especificaciones. Cada dato con fuente cuando se verifique.

-- Fabricantes (los más comunes en Paraguay)
insert into fabricante (nombre, pais_origen) values
  ('Toyota', 'Japón'),
  ('Chevrolet', 'EE.UU.'),
  ('Ford', 'EE.UU.'),
  ('Volkswagen', 'Alemania'),
  ('Hyundai', 'Corea del Sur'),
  ('Kia', 'Corea del Sur'),
  ('Nissan', 'Japón'),
  ('Honda', 'Japón'),
  ('Fiat', 'Italia'),
  ('Peugeot', 'Francia'),
  ('Renault', 'Francia'),
  ('Mitsubishi', 'Japón'),
  ('Suzuki', 'Japón'),
  ('Mazda', 'Japón'),
  ('Mercedes-Benz', 'Alemania')
on conflict (nombre) do nothing;

-- Marcas principales (ejemplos, se amplían en F6)
insert into marca (fabricante_id, nombre)
select f.id, 'Toyota' from fabricante f where f.nombre = 'Toyota'
on conflict do nothing;

insert into marca (fabricante_id, nombre)
select f.id, 'Chevrolet' from fabricante f where f.nombre = 'Chevrolet'
on conflict do nothing;

insert into marca (fabricante_id, nombre)
select f.id, 'Ford' from fabricante f where f.nombre = 'Ford'
on conflict do nothing;

insert into marca (fabricante_id, nombre)
select f.id, 'Volkswagen' from fabricante f where f.nombre = 'Volkswagen'
on conflict do nothing;

insert into marca (fabricante_id, nombre)
select f.id, 'Hyundai' from fabricante f where f.nombre = 'Hyundai'
on conflict do nothing;

-- Modelos (ejemplos de Toyota, se amplían en F6)
insert into modelo (marca_id, nombre, anio_desde)
select m.id, 'Corolla', 2000 from marca m where m.nombre = 'Toyota'
on conflict do nothing;

insert into modelo (marca_id, nombre, anio_desde)
select m.id, 'Hilux', 2000 from marca m where m.nombre = 'Toyota'
on conflict do nothing;

insert into modelo (marca_id, nombre, anio_desde)
select m.id, 'Etios', 2010 from marca m where m.nombre = 'Toyota'
on conflict do nothing;

-- Servicios globales (los más comunes en lubricentros paraguayos)
insert into servicio_global (nombre, descripcion, intervalo_meses_sugerido, intervalo_km_sugerido) values
  ('Cambio de aceite de motor', 'Drenaje y reemplazo de aceite de motor', 6, 10000),
  ('Cambio de filtro de aceite', 'Reemplazo del filtro de aceite', 6, 10000),
  ('Cambio de filtro de aire', 'Reemplazo del filtro de aire del motor', 12, 20000),
  ('Cambio de filtro de combustible', 'Reemplazo del filtro de combustible', 12, 20000),
  ('Cambio de filtro de habitáculo', 'Reemplazo del filtro de aire acondicionado', 12, 20000),
  ('Revisión de niveles', 'Control de niveles de fluidos (frenos, refrigerante, dirección)', 3, 5000),
  ('Cambio de aceite de caja', 'Drenaje y reemplazo de aceite de transmisión', 24, 40000),
  ('Cambio de líquido de frenos', 'Reemplazo del líquido de frenos', 24, 40000),
  ('Alineación y balanceo', 'Alineación de dirección y balanceo de ruedas', 12, 10000),
  ('Cambio de correa de distribución', 'Reemplazo de correa de distribución', 60, 100000)
on conflict (nombre) do nothing;

-- Productos globales (ejemplos de aceites y filtros)
insert into producto_global (nombre, marca, tipo, viscosidad) values
  ('Aceite 5W-30 sintético', '[PENDIENTE]', 'aceite', '5W-30'),
  ('Aceite 10W-40 semisintético', '[PENDIENTE]', 'aceite', '10W-40'),
  ('Aceite 15W-40 mineral', '[PENDIENTE]', 'aceite', '15W-40'),
  ('Aceite 0W-20 sintético', '[PENDIENTE]', 'aceite', '0W-20'),
  ('Filtro de aceite', '[PENDIENTE]', 'filtro', null),
  ('Filtro de aire', '[PENDIENTE]', 'filtro', null),
  ('Filtro de combustible', '[PENDIENTE]', 'filtro', null),
  ('Filtro de habitáculo', '[PENDIENTE]', 'filtro', null)
on conflict do nothing;

-- Nota: los productos globales tienen marca [PENDIENTE] porque no se puede
-- inventar. En F6 se cargan las marcas reales (Mobil, Shell, Castrol, etc.)
-- con sus especificaciones verificadas.

-- Especificaciones de lubricantes: vacío en seed.
-- Se pueblan en F6 con datos verificados de fuentes oficiales.
-- Regla: no inventar especificaciones.