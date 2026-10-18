-- =====================================================================
-- sistema de gestión de trámites de licencias de conducir
-- municipalidad de santo domingo - proyecto inf3245
-- motor: postgresql
-- =====================================================================
-- cómo ejecutarlo en dbeaver:
--   1. conectado a la base "postgres", ejecutar solo la sentencia
--      create database (ctrl+enter sobre esa línea)
--   2. cambiar la conexión activa a la base "licencias"
--   3. ejecutar desde la sección "limpieza" hasta el final (alt+x)
-- con psql: ejecutar create database y luego \c licencias
-- =====================================================================

-- create database licencias;


-- ---------------------------------------------------------------------
-- limpieza: permite volver a ejecutar el script desde cero
-- ---------------------------------------------------------------------
drop table if exists requiere, historial_estado, cita, documento, tramite,
    usuario, bloque_horario, metodo_notificacion, tipo_documento,
    estado_documento, estado_tramite, tipo_tramite, rol cascade;


-- ---------------------------------------------------------------------
-- catálogos
-- ---------------------------------------------------------------------
create table rol (
    id_rol integer generated always as identity,
    nombre_rol varchar(40) not null unique,
    primary key (id_rol)
);

create table tipo_tramite (
    id_tipo_tramite integer generated always as identity,
    nombre_tipo_tramite varchar(40) not null unique,
    duracion_min integer not null check (duracion_min > 0),
    primary key (id_tipo_tramite)
);

create table tipo_documento (
    id_tipo_documento integer generated always as identity,
    nombre_tipo_documento varchar(50) not null unique,
    primary key (id_tipo_documento)
);

create table estado_tramite (
    id_estado_tramite integer generated always as identity,
    nombre_estado_tramite varchar(40) not null unique,
    primary key (id_estado_tramite)
);

create table estado_documento (
    id_estado_documento integer generated always as identity,
    nombre_estado_documento varchar(30) not null unique,
    primary key (id_estado_documento)
);

create table metodo_notificacion (
    id_metodo_notificacion integer generated always as identity,
    nombre_metodo_notificacion varchar(40) not null unique,
    primary key (id_metodo_notificacion)
);


-- ---------------------------------------------------------------------
-- tablas principales
-- ---------------------------------------------------------------------
create table usuario (
    rut varchar(10) not null,              -- normalizado sin puntos y con guion: 12345678-9
    nombre varchar(60) not null,
    correo varchar(100) not null unique,
    telefono varchar(15),                  -- opcional, solo para notificar por whatsapp
    clave_hash varchar(100) not null,      -- hash bcrypt (60 caracteres)
    activo boolean not null default true,
    id_rol integer not null,
    primary key (rut),
    foreign key (id_rol) references rol (id_rol),
    check (rut ~ '^[0-9]{7,8}-[0-9Kk]$')   -- formato del rut normalizado
);

create table bloque_horario (
    id_bloque_horario integer generated always as identity,
    fecha date not null,
    hora_inicio time not null,
    hora_fin time not null,
    cupos integer not null check (cupos > 0),
    activo boolean not null default true,
    primary key (id_bloque_horario),
    unique (fecha, hora_inicio),           -- no puede haber dos bloques que partan a la misma hora el mismo día
    check (hora_fin > hora_inicio)
);

create table tramite (
    id_tramite integer generated always as identity,
    fecha_inicio timestamp not null default now(),
    rut_ciudadano varchar(10) not null,
    id_tipo_tramite integer not null,
    id_estado_tramite integer not null,    -- estado actual; el detalle de cambios está en historial_estado
    primary key (id_tramite),
    foreign key (rut_ciudadano) references usuario (rut),
    foreign key (id_tipo_tramite) references tipo_tramite (id_tipo_tramite),
    foreign key (id_estado_tramite) references estado_tramite (id_estado_tramite)
);

create table documento (
    id_documento integer generated always as identity,
    nombre_archivo varchar(255) not null,
    ruta varchar(255),                     -- null hasta implementar la subida real del archivo
    hash char(64),                         -- sha-256 en hexadecimal; null hasta la subida real
    fecha_subida timestamp not null default now(),
    motivo_rechazo varchar(255),           -- solo si fue rechazado
    fecha_revision timestamp,              -- null mientras esté pendiente
    id_tramite integer not null,
    id_tipo_documento integer not null,
    id_estado_documento integer not null,
    rut_revisor varchar(10),               -- funcionario que lo revisó; null mientras esté pendiente
    primary key (id_documento),
    foreign key (id_tramite) references tramite (id_tramite),
    foreign key (id_tipo_documento) references tipo_documento (id_tipo_documento),
    foreign key (id_estado_documento) references estado_documento (id_estado_documento),
    foreign key (rut_revisor) references usuario (rut)
);

create table cita (
    id_cita integer generated always as identity,
    fecha_reserva timestamp not null default now(),
    vigente boolean not null default true, -- false cuando el ciudadano la cancela
    id_tramite integer not null,
    id_bloque_horario integer not null,
    id_metodo_notificacion integer not null,
    primary key (id_cita),
    foreign key (id_tramite) references tramite (id_tramite),
    foreign key (id_bloque_horario) references bloque_horario (id_bloque_horario),
    foreign key (id_metodo_notificacion) references metodo_notificacion (id_metodo_notificacion)
);

-- un trámite solo puede tener una cita vigente a la vez
create unique index cita_vigente_unica on cita (id_tramite) where vigente;

create table historial_estado (
    id_historial_estado integer generated always as identity,
    fecha timestamp not null default now(),
    id_tramite integer not null,
    id_estado_tramite integer not null,
    rut_funcionario varchar(10),           -- null cuando el cambio no lo hizo un funcionario
    primary key (id_historial_estado),
    foreign key (id_tramite) references tramite (id_tramite),
    foreign key (id_estado_tramite) references estado_tramite (id_estado_tramite),
    foreign key (rut_funcionario) references usuario (rut)
);

-- tabla puente de la relación n:m entre tipo_tramite y tipo_documento
create table requiere (
    id_tipo_tramite integer not null,
    id_tipo_documento integer not null,
    primary key (id_tipo_tramite, id_tipo_documento),
    foreign key (id_tipo_tramite) references tipo_tramite (id_tipo_tramite),
    foreign key (id_tipo_documento) references tipo_documento (id_tipo_documento)
);


-- ---------------------------------------------------------------------
-- datos iniciales de los catálogos
-- (los id se generan en el orden de inserción: 1, 2, 3...)
-- ---------------------------------------------------------------------
insert into rol (nombre_rol) values ('ciudadano'), ('funcionario'), ('administrador');

insert into tipo_tramite (nombre_tipo_tramite, duracion_min) values
    ('Licencia (primera vez)', 30),
    ('Renovación', 20),
    ('Reimpresión', 20);

-- (ajustar según los documentos definidos en el figma)
insert into tipo_documento (nombre_tipo_documento) values
    ('Cédula de identidad'),
    ('Certificado de residencia'),
    ('Certificado de educación básica'),
    ('Licencia anterior'),
    ('Constancia de denuncia por robo o extravío');

insert into requiere (id_tipo_tramite, id_tipo_documento) values
    (1, 1), (1, 2), (1, 3),   -- primera vez: cédula, residencia, educación básica
    (2, 1), (2, 4),           -- renovación: cédula, licencia anterior
    (3, 1), (3, 5);           -- reimpresión: cédula, constancia de denuncia

insert into estado_tramite (nombre_estado_tramite) values
    ('Cita reservada'),
    ('Examen teórico aprobado'),
    ('Examen psicotécnico aprobado'),
    ('Fotografía capturada'),
    ('Licencia en impresión'),
    ('Lista para retiro'),
    ('Rechazado'),
    ('Examen práctico aprobado');          -- va al final para no cambiar los ids anteriores (queda con id 8)

insert into estado_documento (nombre_estado_documento) values ('Pendiente'), ('Aprobado'), ('Rechazado');

insert into metodo_notificacion (nombre_metodo_notificacion) values ('Correo'), ('WhatsApp');


-- ---------------------------------------------------------------------
-- datos de prueba
-- contraseña de los tres usuarios: Clave123!
-- ---------------------------------------------------------------------
insert into usuario (rut, nombre, correo, telefono, clave_hash, id_rol) values
    ('20123456-5', 'Ciudadano Prueba', 'ciudadano@prueba.cl', '+56911111111', '$2b$10$Cm5dvzMpMmK12ta.GFMzA.B/3XRuzoc4LA/nhl5c0bAkQeFfV38b2', 1),
    ('12345678-5', 'Funcionario Prueba', 'funcionario@prueba.cl', null, '$2b$10$Cm5dvzMpMmK12ta.GFMzA.B/3XRuzoc4LA/nhl5c0bAkQeFfV38b2', 2),
    ('11111111-1', 'Administrador Prueba', 'admin@prueba.cl', null, '$2b$10$Cm5dvzMpMmK12ta.GFMzA.B/3XRuzoc4LA/nhl5c0bAkQeFfV38b2', 3);

insert into bloque_horario (fecha, hora_inicio, hora_fin, cupos) values
    ('2026-10-19', '09:00', '09:30', 2),
    ('2026-10-19', '09:30', '10:00', 2),
    ('2026-10-20', '09:00', '09:30', 2);

-- ---------------------------------------------------------------------
-- para saber detalles para el .env si es necesario
-- ---------------------------------------------------------------------
-- select current_user, current_database(), inet_server_port();
