-- Agrega la opción "Correo y WhatsApp" al catálogo de métodos de notificación.
-- Para bases creadas antes de este cambio; en licencias.sql ya viene incluida.
insert into metodo_notificacion (nombre_metodo_notificacion)
select 'Correo y WhatsApp'
where not exists (
    select 1 from metodo_notificacion where nombre_metodo_notificacion = 'Correo y WhatsApp'
);
