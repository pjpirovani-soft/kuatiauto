-- 017_seed_marcas_modelos.sql
-- E3b: completa marcas faltantes y agrega modelos populares en Paraguay.
-- Idempotente: ON CONFLICT DO NOTHING en todos los inserts.

-- Marcas faltantes (fabricante existe, marca homónima no).
insert into marca (fabricante_id, nombre)
select f.id, f.nombre from fabricante f
where f.nombre in (
  'Fiat', 'Honda', 'Kia', 'Mazda', 'Mercedes-Benz',
  'Mitsubishi', 'Nissan', 'Peugeot', 'Renault', 'Suzuki'
)
on conflict (fabricante_id, nombre) do nothing;

-- Modelos populares en Paraguay.
-- Toyota
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Yaris', 2020),
  ('RAV4', 2015),
  ('Fortuner', 2015)
) as m(nombre, anio)
where ma.nombre = 'Toyota'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Chevrolet
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Onix', 2020),
  ('Prisma', 2015),
  ('Cruze', 2015),
  ('S10', 2015),
  ('Spin', 2015)
) as m(nombre, anio)
where ma.nombre = 'Chevrolet'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Ford
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Ka', 2015),
  ('Fiesta', 2015),
  ('Focus', 2015),
  ('Ranger', 2015),
  ('EcoSport', 2015)
) as m(nombre, anio)
where ma.nombre = 'Ford'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Volkswagen
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Gol', 2015),
  ('Polo', 2015),
  ('Vento', 2015),
  ('Amarok', 2015),
  ('Saveiro', 2015)
) as m(nombre, anio)
where ma.nombre = 'Volkswagen'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Hyundai
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Accent', 2015),
  ('Tucson', 2015),
  ('Santa Fe', 2015),
  ('i10', 2015),
  ('Creta', 2020)
) as m(nombre, anio)
where ma.nombre = 'Hyundai'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Nissan
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('March', 2015),
  ('Versa', 2015),
  ('Sentra', 2015),
  ('Kicks', 2017),
  ('Frontier', 2015)
) as m(nombre, anio)
where ma.nombre = 'Nissan'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Kia
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Rio', 2015),
  ('Picanto', 2015),
  ('Sportage', 2015),
  ('Sorento', 2015),
  ('Cerato', 2015)
) as m(nombre, anio)
where ma.nombre = 'Kia'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Honda
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Fit', 2015),
  ('City', 2015),
  ('Civic', 2015),
  ('CR-V', 2015),
  ('HR-V', 2016)
) as m(nombre, anio)
where ma.nombre = 'Honda'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Fiat
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Palio', 2010),
  ('Uno', 2015),
  ('Siena', 2010),
  ('Cronos', 2019),
  ('Strada', 2015)
) as m(nombre, anio)
where ma.nombre = 'Fiat'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Renault
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Sandero', 2015),
  ('Logan', 2015),
  ('Duster', 2015),
  ('Kangoo', 2015),
  ('Kwid', 2018)
) as m(nombre, anio)
where ma.nombre = 'Renault'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Peugeot
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('208', 2015),
  ('2008', 2015),
  ('308', 2015),
  ('3008', 2017),
  ('408', 2015)
) as m(nombre, anio)
where ma.nombre = 'Peugeot'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Suzuki
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Swift', 2015),
  ('Vitara', 2015),
  ('Jimny', 2015),
  ('S-Cross', 2015)
) as m(nombre, anio)
where ma.nombre = 'Suzuki'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Mitsubishi
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Lancer', 2015),
  ('Outlander', 2015),
  ('Montero', 2015),
  ('L200', 2015)
) as m(nombre, anio)
where ma.nombre = 'Mitsubishi'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Mazda
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Mazda2', 2015),
  ('Mazda3', 2015),
  ('CX-5', 2015),
  ('BT-50', 2015)
) as m(nombre, anio)
where ma.nombre = 'Mazda'
on conflict (marca_id, nombre, anio_desde) do nothing;

-- Mercedes-Benz
insert into modelo (marca_id, nombre, anio_desde)
select ma.id, m.nombre, m.anio from marca ma
cross join (values
  ('Clase A', 2015),
  ('Clase C', 2015),
  ('Clase E', 2015),
  ('GLC', 2016),
  ('Sprinter', 2015)
) as m(nombre, anio)
where ma.nombre = 'Mercedes-Benz'
on conflict (marca_id, nombre, anio_desde) do nothing;