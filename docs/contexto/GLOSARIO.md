# GLOSARIO — KuatiAuto (provisional)

Términos canónicos del proyecto. Si un término aparece en otro doc, debe coincidir con esta definición.

## Producto

**KuatiAuto (provisional)** — Nombre de trabajo del producto. Plataforma SaaS multiempresa de gestión y mantenimiento automotor para Paraguay. Une *kuatia* (registro, papel, historial en guaraní) + *auto*, comunicando "el registro de tu vehículo".
- Dominio `kuatiauto.com.py` verificado como disponible el 2026-10-30 (NIC.py), **sin registrar**.
- Pendiente: verificar redes (@kuatiauto) y DINAPI (clases 9, 35, 42).
- Estado: PROPUESTO. Pasa a DECIDIDO cuando se registre dominio + verifiquen redes + DINAPI.

## Actores

**Administrador general** — Rol de plataforma. Gestiona altas/bajas de empresas, catálogo global, configuración del sistema. No opera datos de negocio de ninguna empresa.

**Empresa** (o *tenant*) — Entidad comercial que contrata KuatiAuto. Tiene uno o más establecimientos. Es la unidad de aislamiento multiempresa.

**Establecimiento** — Local físico donde se prestan servicios automotrices. Pertenece a una empresa. Tiene dirección, horarios, servicios ofrecidos. En el MVP: 1 empresa = 1 establecimiento (el modelo soporta 1:N).

**Propietario de empresa** — Usuario con rol máximo dentro de una empresa. Puede invitar empleados, configurar el establecimiento, ver toda la operación de su empresa.

**Empleado** — Usuario que opera dentro de una empresa con permisos limitados. En el MVP: mismo rol que propietario salvo gestión de usuarios.

**Conductor / Cliente particular** — Persona dueña o responsable de un vehículo. En el MVP **no tiene cuenta propia**: existe como registro `cliente` dentro de cada empresa. Portal del conductor → v2.

## Datos

**Cliente** — Registro de una persona física o jurídica dentro de una empresa. Tiene nombre, contacto, y uno o más vehículos. Aislado por empresa (RLS).

**Vehículo** — Registro de un vehículo dentro de una empresa. Tiene marca, modelo, año, motorización, patente, kilometraje. En el MVP pertenece a la empresa (RLS por `empresa_id`).

**Vehículo_identidad** — Tabla auxiliar que normaliza patente y VIN para permitir consolidación de historial entre empresas en v2. En el MVP se puebla pero no se expone cross-tenant. Ver ADR-002.

**Orden de trabajo** — Registro de un servicio realizado a un vehículo en un establecimiento. Contiene fecha, kilometraje, servicios, productos, importe, próximo mantenimiento. Aislado por empresa.

**Servicio** — Tipo de trabajo ofrecido o realizado (cambio de aceite, filtro, revisión). Catálogo por empresa en el MVP; catálogo global en v2.

**Catálogo automotriz** — Base de conocimiento compartida con especificaciones técnicas (viscosidad, normas API/ACEA, capacidades, intervalos). Tiene estado `pendiente` / `verificado` / `disputado`, fuente documental y fecha de verificación. En el MVP arranca mínimo, con datos del piloto.

## Técnicos

**RLS** (Row Level Security) — Mecanismo de PostgreSQL que restringe filas por política. Es la primera línea de aislamiento multiempresa. No es opcional.

**Tenant** — Sinónimo de *empresa* en contexto técnico. Preferimos *empresa* en producto y *tenant* en arquitectura.

**SECURITY DEFINER** — Función SQL que se ejecuta con los permisos de su creador, no del invocador. Se usa solo cuando una operación cross-tenant lo justifica. Su uso requiere revisión explícita (R13).

**Gate de seguridad** — Protocolo obligatorio antes de marcar un módulo como `completo` en `STATUS.md`. Ver `ARCHITECTURE.md` sección Seguridad.

## Convenciones de escritura

- Nombres propios en español: *empresa*, *establecimiento*, *cliente*, *vehículo*.
- Tablas SQL en singular snake_case: `empresa`, `establecimiento`, `cliente`, `vehiculo`, `orden_trabajo`.
- En prosa, los términos del glosario van en minúscula salvo al inicio de oración. `KuatiAuto` siempre con la capitalización exacta.