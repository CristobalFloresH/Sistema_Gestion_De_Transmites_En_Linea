-- Agrega bloques horarios para los próximos 7 días hábiles, igual que el seed de licencias.sql.
-- Sirve para una base que ya existe y cuyos bloques quedaron en el pasado: no borra nada ni toca
-- las citas ya reservadas, y se puede ejecutar las veces que haga falta (los repetidos se ignoran).
with dias as (
    select d::date as fecha
    from generate_series(current_date, current_date + 13, interval '1 day') as d
    where extract(isodow from d) < 6        -- solo de lunes a viernes
    order by d
    limit 7
)
insert into bloque_horario (fecha, hora_inicio, hora_fin, cupos)
select fecha, h::time, (h + interval '30 minutes')::time, 2
from dias,
     generate_series(timestamp '2000-01-01 09:00', timestamp '2000-01-01 12:30', interval '30 minutes') as h
on conflict (fecha, hora_inicio) do nothing;
