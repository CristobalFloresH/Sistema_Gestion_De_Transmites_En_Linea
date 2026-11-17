--
-- PostgreSQL database dump
--

\restrict uZVwMrWnBHdU4X6X0EPZx15Xk7CHA3XmyYP5FGcCmtxQvFJdFhxadXTXfdJmkJb

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS usuario_id_rol_fkey;
ALTER TABLE IF EXISTS ONLY public.tramite DROP CONSTRAINT IF EXISTS tramite_rut_ciudadano_fkey;
ALTER TABLE IF EXISTS ONLY public.tramite DROP CONSTRAINT IF EXISTS tramite_id_tipo_tramite_fkey;
ALTER TABLE IF EXISTS ONLY public.tramite DROP CONSTRAINT IF EXISTS tramite_id_estado_tramite_fkey;
ALTER TABLE IF EXISTS ONLY public.requiere DROP CONSTRAINT IF EXISTS requiere_id_tipo_tramite_fkey;
ALTER TABLE IF EXISTS ONLY public.requiere DROP CONSTRAINT IF EXISTS requiere_id_tipo_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.historialestado DROP CONSTRAINT IF EXISTS historialestado_idestadotramite_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_rut_funcionario_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_id_tramite_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_id_estado_tramite_fkey;
ALTER TABLE IF EXISTS ONLY public.documento DROP CONSTRAINT IF EXISTS documento_rut_revisor_fkey;
ALTER TABLE IF EXISTS ONLY public.documento DROP CONSTRAINT IF EXISTS documento_id_tramite_fkey;
ALTER TABLE IF EXISTS ONLY public.documento DROP CONSTRAINT IF EXISTS documento_id_tipo_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.documento DROP CONSTRAINT IF EXISTS documento_id_estado_documento_fkey;
ALTER TABLE IF EXISTS ONLY public.cita DROP CONSTRAINT IF EXISTS cita_id_tramite_fkey;
ALTER TABLE IF EXISTS ONLY public.cita DROP CONSTRAINT IF EXISTS cita_id_metodo_notificacion_fkey;
ALTER TABLE IF EXISTS ONLY public.cita DROP CONSTRAINT IF EXISTS cita_id_bloque_horario_fkey;
DROP INDEX IF EXISTS public.cita_vigente_unica;
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS usuario_pkey;
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS usuario_correo_key;
ALTER TABLE IF EXISTS ONLY public.tramite DROP CONSTRAINT IF EXISTS tramite_pkey;
ALTER TABLE IF EXISTS ONLY public.tipotramite DROP CONSTRAINT IF EXISTS tipotramite_pkey;
ALTER TABLE IF EXISTS ONLY public.tipotramite DROP CONSTRAINT IF EXISTS tipotramite_nombretipotramite_key;
ALTER TABLE IF EXISTS ONLY public.tipodocumento DROP CONSTRAINT IF EXISTS tipodocumento_pkey;
ALTER TABLE IF EXISTS ONLY public.tipodocumento DROP CONSTRAINT IF EXISTS tipodocumento_nombretipodocumento_key;
ALTER TABLE IF EXISTS ONLY public.tipo_tramite DROP CONSTRAINT IF EXISTS tipo_tramite_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_tramite DROP CONSTRAINT IF EXISTS tipo_tramite_nombre_tipo_tramite_key;
ALTER TABLE IF EXISTS ONLY public.tipo_documento DROP CONSTRAINT IF EXISTS tipo_documento_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_documento DROP CONSTRAINT IF EXISTS tipo_documento_nombre_tipo_documento_key;
ALTER TABLE IF EXISTS ONLY public.rol DROP CONSTRAINT IF EXISTS rol_pkey;
ALTER TABLE IF EXISTS ONLY public.rol DROP CONSTRAINT IF EXISTS rol_nombre_rol_key;
ALTER TABLE IF EXISTS ONLY public.requiere DROP CONSTRAINT IF EXISTS requiere_pkey;
ALTER TABLE IF EXISTS ONLY public.metodonotificacion DROP CONSTRAINT IF EXISTS metodonotificacion_pkey;
ALTER TABLE IF EXISTS ONLY public.metodonotificacion DROP CONSTRAINT IF EXISTS metodonotificacion_nombremetodonotificacion_key;
ALTER TABLE IF EXISTS ONLY public.metodo_notificacion DROP CONSTRAINT IF EXISTS metodo_notificacion_pkey;
ALTER TABLE IF EXISTS ONLY public.metodo_notificacion DROP CONSTRAINT IF EXISTS metodo_notificacion_nombre_metodo_notificacion_key;
ALTER TABLE IF EXISTS ONLY public.historialestado DROP CONSTRAINT IF EXISTS historialestado_pkey;
ALTER TABLE IF EXISTS ONLY public.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_pkey;
ALTER TABLE IF EXISTS ONLY public.estadotramite DROP CONSTRAINT IF EXISTS estadotramite_pkey;
ALTER TABLE IF EXISTS ONLY public.estadotramite DROP CONSTRAINT IF EXISTS estadotramite_nombreestadotramite_key;
ALTER TABLE IF EXISTS ONLY public.estadodocumento DROP CONSTRAINT IF EXISTS estadodocumento_pkey;
ALTER TABLE IF EXISTS ONLY public.estadodocumento DROP CONSTRAINT IF EXISTS estadodocumento_nombreestadodocumento_key;
ALTER TABLE IF EXISTS ONLY public.estado_tramite DROP CONSTRAINT IF EXISTS estado_tramite_pkey;
ALTER TABLE IF EXISTS ONLY public.estado_tramite DROP CONSTRAINT IF EXISTS estado_tramite_nombre_estado_tramite_key;
ALTER TABLE IF EXISTS ONLY public.estado_documento DROP CONSTRAINT IF EXISTS estado_documento_pkey;
ALTER TABLE IF EXISTS ONLY public.estado_documento DROP CONSTRAINT IF EXISTS estado_documento_nombre_estado_documento_key;
ALTER TABLE IF EXISTS ONLY public.documento DROP CONSTRAINT IF EXISTS documento_pkey;
ALTER TABLE IF EXISTS ONLY public.cita DROP CONSTRAINT IF EXISTS cita_pkey;
ALTER TABLE IF EXISTS ONLY public.bloquehorario DROP CONSTRAINT IF EXISTS bloquehorario_pkey;
ALTER TABLE IF EXISTS ONLY public.bloquehorario DROP CONSTRAINT IF EXISTS bloquehorario_fecha_horainicio_key;
ALTER TABLE IF EXISTS ONLY public.bloque_horario DROP CONSTRAINT IF EXISTS bloque_horario_pkey;
ALTER TABLE IF EXISTS ONLY public.bloque_horario DROP CONSTRAINT IF EXISTS bloque_horario_fecha_hora_inicio_key;
DROP TABLE IF EXISTS public.usuario;
DROP TABLE IF EXISTS public.tramite;
DROP TABLE IF EXISTS public.tipotramite;
DROP TABLE IF EXISTS public.tipodocumento;
DROP TABLE IF EXISTS public.tipo_tramite;
DROP TABLE IF EXISTS public.tipo_documento;
DROP TABLE IF EXISTS public.rol;
DROP TABLE IF EXISTS public.requiere;
DROP TABLE IF EXISTS public.metodonotificacion;
DROP TABLE IF EXISTS public.metodo_notificacion;
DROP TABLE IF EXISTS public.historialestado;
DROP TABLE IF EXISTS public.historial_estado;
DROP TABLE IF EXISTS public.estadotramite;
DROP TABLE IF EXISTS public.estadodocumento;
DROP TABLE IF EXISTS public.estado_tramite;
DROP TABLE IF EXISTS public.estado_documento;
DROP TABLE IF EXISTS public.documento;
DROP TABLE IF EXISTS public.cita;
DROP TABLE IF EXISTS public.bloquehorario;
DROP TABLE IF EXISTS public.bloque_horario;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bloque_horario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bloque_horario (
    id_bloque_horario integer NOT NULL,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    cupos integer NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    CONSTRAINT bloque_horario_check CHECK ((hora_fin > hora_inicio)),
    CONSTRAINT bloque_horario_cupos_check CHECK ((cupos > 0))
);


ALTER TABLE public.bloque_horario OWNER TO postgres;

--
-- Name: bloque_horario_id_bloque_horario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.bloque_horario ALTER COLUMN id_bloque_horario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bloque_horario_id_bloque_horario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bloquehorario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bloquehorario (
    idbloquehorario integer NOT NULL,
    fecha date NOT NULL,
    horainicio time without time zone NOT NULL,
    horafin time without time zone NOT NULL,
    cupos integer NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.bloquehorario OWNER TO postgres;

--
-- Name: bloquehorario_idbloquehorario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.bloquehorario ALTER COLUMN idbloquehorario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bloquehorario_idbloquehorario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cita (
    id_cita integer NOT NULL,
    fecha_reserva timestamp without time zone DEFAULT now() NOT NULL,
    vigente boolean DEFAULT true NOT NULL,
    id_tramite integer NOT NULL,
    id_bloque_horario integer NOT NULL,
    id_metodo_notificacion integer NOT NULL
);


ALTER TABLE public.cita OWNER TO postgres;

--
-- Name: cita_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cita ALTER COLUMN id_cita ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cita_id_cita_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documento (
    id_documento integer NOT NULL,
    nombre_archivo character varying(255) NOT NULL,
    ruta character varying(255),
    hash character(64),
    fecha_subida timestamp without time zone DEFAULT now() NOT NULL,
    motivo_rechazo character varying(255),
    fecha_revision timestamp without time zone,
    id_tramite integer NOT NULL,
    id_tipo_documento integer NOT NULL,
    id_estado_documento integer NOT NULL,
    rut_revisor character varying(10)
);


ALTER TABLE public.documento OWNER TO postgres;

--
-- Name: documento_id_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.documento ALTER COLUMN id_documento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.documento_id_documento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estado_documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_documento (
    id_estado_documento integer NOT NULL,
    nombre_estado_documento character varying(30) NOT NULL
);


ALTER TABLE public.estado_documento OWNER TO postgres;

--
-- Name: estado_documento_id_estado_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.estado_documento ALTER COLUMN id_estado_documento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estado_documento_id_estado_documento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estado_tramite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_tramite (
    id_estado_tramite integer NOT NULL,
    nombre_estado_tramite character varying(40) NOT NULL
);


ALTER TABLE public.estado_tramite OWNER TO postgres;

--
-- Name: estado_tramite_id_estado_tramite_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.estado_tramite ALTER COLUMN id_estado_tramite ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estado_tramite_id_estado_tramite_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estadodocumento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estadodocumento (
    idestadodocumento integer NOT NULL,
    nombreestadodocumento character varying(30) NOT NULL
);


ALTER TABLE public.estadodocumento OWNER TO postgres;

--
-- Name: estadodocumento_idestadodocumento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.estadodocumento ALTER COLUMN idestadodocumento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estadodocumento_idestadodocumento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estadotramite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estadotramite (
    idestadotramite integer NOT NULL,
    nombreestadotramite character varying(40) NOT NULL
);


ALTER TABLE public.estadotramite OWNER TO postgres;

--
-- Name: estadotramite_idestadotramite_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.estadotramite ALTER COLUMN idestadotramite ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estadotramite_idestadotramite_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historial_estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_estado (
    id_historial_estado integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_tramite integer NOT NULL,
    id_estado_tramite integer NOT NULL,
    rut_funcionario character varying(10)
);


ALTER TABLE public.historial_estado OWNER TO postgres;

--
-- Name: historial_estado_id_historial_estado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historial_estado ALTER COLUMN id_historial_estado ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historial_estado_id_historial_estado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historialestado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historialestado (
    idhistorialestado integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    idtramite integer NOT NULL,
    idestadotramite integer NOT NULL,
    rutfuncionario character varying(10)
);


ALTER TABLE public.historialestado OWNER TO postgres;

--
-- Name: historialestado_idhistorialestado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historialestado ALTER COLUMN idhistorialestado ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historialestado_idhistorialestado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: metodo_notificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodo_notificacion (
    id_metodo_notificacion integer NOT NULL,
    nombre_metodo_notificacion character varying(40) NOT NULL
);


ALTER TABLE public.metodo_notificacion OWNER TO postgres;

--
-- Name: metodo_notificacion_id_metodo_notificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.metodo_notificacion ALTER COLUMN id_metodo_notificacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.metodo_notificacion_id_metodo_notificacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: metodonotificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodonotificacion (
    idmetodonotificacion integer NOT NULL,
    nombremetodonotificacion character varying(40) NOT NULL
);


ALTER TABLE public.metodonotificacion OWNER TO postgres;

--
-- Name: metodonotificacion_idmetodonotificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.metodonotificacion ALTER COLUMN idmetodonotificacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.metodonotificacion_idmetodonotificacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: requiere; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requiere (
    id_tipo_tramite integer NOT NULL,
    id_tipo_documento integer NOT NULL
);


ALTER TABLE public.requiere OWNER TO postgres;

--
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    nombre_rol character varying(40) NOT NULL
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rol ALTER COLUMN id_rol ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rol_id_rol_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipo_documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_documento (
    id_tipo_documento integer NOT NULL,
    nombre_tipo_documento character varying(50) NOT NULL
);


ALTER TABLE public.tipo_documento OWNER TO postgres;

--
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipo_documento ALTER COLUMN id_tipo_documento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_documento_id_tipo_documento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipo_tramite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_tramite (
    id_tipo_tramite integer NOT NULL,
    nombre_tipo_tramite character varying(40) NOT NULL,
    duracion_min integer NOT NULL,
    CONSTRAINT tipo_tramite_duracion_min_check CHECK ((duracion_min > 0))
);


ALTER TABLE public.tipo_tramite OWNER TO postgres;

--
-- Name: tipo_tramite_id_tipo_tramite_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipo_tramite ALTER COLUMN id_tipo_tramite ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipo_tramite_id_tipo_tramite_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipodocumento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipodocumento (
    idtipodocumento integer NOT NULL,
    nombretipodocumento character varying(50) NOT NULL
);


ALTER TABLE public.tipodocumento OWNER TO postgres;

--
-- Name: tipodocumento_idtipodocumento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipodocumento ALTER COLUMN idtipodocumento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipodocumento_idtipodocumento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipotramite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipotramite (
    idtipotramite integer NOT NULL,
    nombretipotramite character varying(40) NOT NULL,
    duracionmin integer NOT NULL
);


ALTER TABLE public.tipotramite OWNER TO postgres;

--
-- Name: tipotramite_idtipotramite_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipotramite ALTER COLUMN idtipotramite ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipotramite_idtipotramite_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tramite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tramite (
    id_tramite integer NOT NULL,
    fecha_inicio timestamp without time zone DEFAULT now() NOT NULL,
    rut_ciudadano character varying(10) NOT NULL,
    id_tipo_tramite integer NOT NULL,
    id_estado_tramite integer NOT NULL
);


ALTER TABLE public.tramite OWNER TO postgres;

--
-- Name: tramite_id_tramite_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tramite ALTER COLUMN id_tramite ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tramite_id_tramite_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    rut character varying(10) NOT NULL,
    nombre character varying(60) NOT NULL,
    correo character varying(100) NOT NULL,
    telefono character varying(15),
    clave_hash character varying(100) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    id_rol integer NOT NULL,
    CONSTRAINT usuario_rut_check CHECK (((rut)::text ~ '^[0-9]{7,8}-[0-9Kk]$'::text))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Data for Name: bloque_horario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bloque_horario (id_bloque_horario, fecha, hora_inicio, hora_fin, cupos, activo) FROM stdin;
1	2026-10-22	09:00:00	09:30:00	2	t
2	2026-10-22	09:30:00	10:00:00	2	t
3	2026-10-22	10:00:00	10:30:00	2	t
4	2026-10-22	10:30:00	11:00:00	2	t
5	2026-10-22	11:00:00	11:30:00	2	t
6	2026-10-22	11:30:00	12:00:00	2	t
7	2026-10-22	12:00:00	12:30:00	2	t
8	2026-10-22	12:30:00	13:00:00	2	t
9	2026-10-23	09:00:00	09:30:00	2	t
10	2026-10-23	09:30:00	10:00:00	2	t
11	2026-10-23	10:00:00	10:30:00	2	t
12	2026-10-23	10:30:00	11:00:00	2	t
13	2026-10-23	11:00:00	11:30:00	2	t
14	2026-10-23	11:30:00	12:00:00	2	t
15	2026-10-23	12:00:00	12:30:00	2	t
16	2026-10-23	12:30:00	13:00:00	2	t
17	2026-10-26	09:00:00	09:30:00	2	t
18	2026-10-26	09:30:00	10:00:00	2	t
19	2026-10-26	10:00:00	10:30:00	2	t
20	2026-10-26	10:30:00	11:00:00	2	t
21	2026-10-26	11:00:00	11:30:00	2	t
22	2026-10-26	11:30:00	12:00:00	2	t
23	2026-10-26	12:00:00	12:30:00	2	t
24	2026-10-26	12:30:00	13:00:00	2	t
25	2026-10-27	09:00:00	09:30:00	2	t
26	2026-10-27	09:30:00	10:00:00	2	t
27	2026-10-27	10:00:00	10:30:00	2	t
28	2026-10-27	10:30:00	11:00:00	2	t
29	2026-10-27	11:00:00	11:30:00	2	t
30	2026-10-27	11:30:00	12:00:00	2	t
31	2026-10-27	12:00:00	12:30:00	2	t
32	2026-10-27	12:30:00	13:00:00	2	t
33	2026-10-28	09:00:00	09:30:00	2	t
34	2026-10-28	09:30:00	10:00:00	2	t
35	2026-10-28	10:00:00	10:30:00	2	t
36	2026-10-28	10:30:00	11:00:00	2	t
37	2026-10-28	11:00:00	11:30:00	2	t
38	2026-10-28	11:30:00	12:00:00	2	t
39	2026-10-28	12:00:00	12:30:00	2	t
40	2026-10-28	12:30:00	13:00:00	2	t
41	2026-10-29	09:00:00	09:30:00	2	t
42	2026-10-29	09:30:00	10:00:00	2	t
43	2026-10-29	10:00:00	10:30:00	2	t
44	2026-10-29	10:30:00	11:00:00	2	t
45	2026-10-29	11:00:00	11:30:00	2	t
46	2026-10-29	11:30:00	12:00:00	2	t
47	2026-10-29	12:00:00	12:30:00	2	t
48	2026-10-29	12:30:00	13:00:00	2	t
49	2026-10-30	09:00:00	09:30:00	2	t
50	2026-10-30	09:30:00	10:00:00	2	t
51	2026-10-30	10:00:00	10:30:00	2	t
52	2026-10-30	10:30:00	11:00:00	2	t
53	2026-10-30	11:00:00	11:30:00	2	t
54	2026-10-30	11:30:00	12:00:00	2	t
55	2026-10-30	12:00:00	12:30:00	2	t
56	2026-10-30	12:30:00	13:00:00	2	t
57	2026-11-10	09:00:00	09:30:00	2	t
58	2026-11-11	09:00:00	09:30:00	2	t
59	2026-11-12	09:00:00	09:30:00	2	t
60	2026-11-13	09:00:00	09:30:00	2	t
62	2026-11-17	09:00:00	09:30:00	2	t
63	2026-11-18	09:00:00	09:30:00	2	t
64	2026-11-10	09:30:00	10:00:00	2	t
65	2026-11-11	09:30:00	10:00:00	2	t
66	2026-11-12	09:30:00	10:00:00	2	t
67	2026-11-13	09:30:00	10:00:00	2	t
68	2026-11-16	09:30:00	10:00:00	2	t
69	2026-11-17	09:30:00	10:00:00	2	t
70	2026-11-18	09:30:00	10:00:00	2	t
71	2026-11-10	10:00:00	10:30:00	2	t
72	2026-11-11	10:00:00	10:30:00	2	t
73	2026-11-12	10:00:00	10:30:00	2	t
74	2026-11-13	10:00:00	10:30:00	2	t
75	2026-11-16	10:00:00	10:30:00	2	t
76	2026-11-17	10:00:00	10:30:00	2	t
77	2026-11-18	10:00:00	10:30:00	2	t
78	2026-11-10	10:30:00	11:00:00	2	t
79	2026-11-11	10:30:00	11:00:00	2	t
80	2026-11-12	10:30:00	11:00:00	2	t
81	2026-11-13	10:30:00	11:00:00	2	t
82	2026-11-16	10:30:00	11:00:00	2	t
83	2026-11-17	10:30:00	11:00:00	2	t
84	2026-11-18	10:30:00	11:00:00	2	t
85	2026-11-10	11:00:00	11:30:00	2	t
86	2026-11-11	11:00:00	11:30:00	2	t
87	2026-11-12	11:00:00	11:30:00	2	t
88	2026-11-13	11:00:00	11:30:00	2	t
89	2026-11-16	11:00:00	11:30:00	2	t
90	2026-11-17	11:00:00	11:30:00	2	t
91	2026-11-18	11:00:00	11:30:00	2	t
92	2026-11-10	11:30:00	12:00:00	2	t
93	2026-11-11	11:30:00	12:00:00	2	t
94	2026-11-12	11:30:00	12:00:00	2	t
95	2026-11-13	11:30:00	12:00:00	2	t
96	2026-11-16	11:30:00	12:00:00	2	t
97	2026-11-17	11:30:00	12:00:00	2	t
98	2026-11-18	11:30:00	12:00:00	2	t
99	2026-11-10	12:00:00	12:30:00	2	t
100	2026-11-11	12:00:00	12:30:00	2	t
101	2026-11-12	12:00:00	12:30:00	2	t
102	2026-11-13	12:00:00	12:30:00	2	t
103	2026-11-16	12:00:00	12:30:00	2	t
104	2026-11-17	12:00:00	12:30:00	2	t
105	2026-11-18	12:00:00	12:30:00	2	t
106	2026-11-10	12:30:00	13:00:00	2	t
107	2026-11-11	12:30:00	13:00:00	2	t
108	2026-11-12	12:30:00	13:00:00	2	t
109	2026-11-13	12:30:00	13:00:00	2	t
110	2026-11-16	12:30:00	13:00:00	2	t
111	2026-11-17	12:30:00	13:00:00	2	t
112	2026-11-18	12:30:00	13:00:00	2	t
136	2026-11-19	10:00:00	10:30:00	2	t
137	2026-11-20	10:00:00	10:30:00	2	t
143	2026-11-19	10:30:00	11:00:00	2	t
144	2026-11-20	10:30:00	11:00:00	2	t
122	2026-11-19	09:00:00	09:30:00	2	t
123	2026-11-20	09:00:00	09:30:00	2	t
129	2026-11-19	09:30:00	10:00:00	2	t
130	2026-11-20	09:30:00	10:00:00	2	t
150	2026-11-19	11:00:00	11:30:00	2	t
151	2026-11-20	11:00:00	11:30:00	2	t
157	2026-11-19	11:30:00	12:00:00	2	t
158	2026-11-20	11:30:00	12:00:00	2	t
164	2026-11-19	12:00:00	12:30:00	2	t
165	2026-11-20	12:00:00	12:30:00	2	t
171	2026-11-19	12:30:00	13:00:00	2	t
172	2026-11-20	12:30:00	13:00:00	2	t
61	2026-11-16	09:00:00	09:30:00	3	t
\.


--
-- Data for Name: bloquehorario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bloquehorario (idbloquehorario, fecha, horainicio, horafin, cupos, activo) FROM stdin;
1	2026-10-19	09:00:00	09:30:00	2	t
2	2026-10-19	09:30:00	10:00:00	2	t
3	2026-10-20	09:00:00	09:30:00	2	t
\.


--
-- Data for Name: cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cita (id_cita, fecha_reserva, vigente, id_tramite, id_bloque_horario, id_metodo_notificacion) FROM stdin;
14	2026-11-16 18:14:19.40933	t	13	61	1
15	2026-11-16 18:14:20.119243	t	14	68	2
16	2026-11-16 18:14:21.072872	t	15	75	1
17	2026-11-16 18:14:21.764767	t	16	82	2
18	2026-11-16 18:14:22.385368	t	17	89	1
19	2026-11-16 18:14:52.442807	t	18	62	1
20	2026-11-16 18:14:53.072968	t	19	69	2
\.


--
-- Data for Name: documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documento (id_documento, nombre_archivo, ruta, hash, fecha_subida, motivo_rechazo, fecha_revision, id_tramite, id_tipo_documento, id_estado_documento, rut_revisor) FROM stdin;
36	cedula.pdf	uploads/d6a1fbcd-81e0-43cb-8768-e5af1b97aed3.pdf	9ef0071d816fbff39c8362cbacca42e92bb49e3c3fbbffbb3c42d6237324a201	2026-11-16 18:14:20.333507	\N	2026-11-16 18:14:20.763898	14	1	2	12345678-5
37	residencia.pdf	uploads/d3d0932b-d890-48cf-a351-6bb8678d5f6d.pdf	e05accdc049411733689eca2de0ef119f5c8083b9e923743bb4bc4073e6120e9	2026-11-16 18:14:20.537636	\N	2026-11-16 18:14:20.79528	14	2	2	12345678-5
38	educacion_basica.pdf	uploads/e7981104-fa8b-4f06-af60-0e7fa78b5160.pdf	f4c07fe20995675788bac5b97072208487d38d0148a3d18c0901dda83078f49e	2026-11-16 18:14:20.746239	\N	2026-11-16 18:14:20.812765	14	3	2	12345678-5
39	cedula.pdf	uploads/a09f0b8e-6c94-43dc-a22a-2fdab5b91237.pdf	697684a669a036e21af9881858325803037c93b0311cee00f8c72597ab886702	2026-11-16 18:14:21.285167	\N	2026-11-16 18:14:21.532889	15	1	2	12345678-5
40	constancia_robo.pdf	uploads/1521f5d6-6ff4-4309-ad1e-03b4041b13c3.pdf	ca2b8420ef69c7c0d532f69d87dd8983368bdb78b13d627cb34c6cf626f9f00a	2026-11-16 18:14:21.514128	\N	2026-11-16 18:14:21.548897	15	5	2	12345678-5
41	cedula.pdf	uploads/fd464c80-6e43-42b2-bdc1-5654dea9ae6d.pdf	aec7afef8c869ff8aa224488ed0ed63153359cfa22745877e06b5f987926dfeb	2026-11-16 18:14:21.96714	\N	\N	16	1	1	\N
42	licencia_anterior.pdf	uploads/591626ba-995c-4330-a588-322e617e27f2.pdf	ea7ecaa7f7699d7416e394dc5d069ab5b38c1cd6b1bfb35f3c9b34b20400c87d	2026-11-16 18:14:22.182565	\N	\N	16	4	1	\N
43	cedula.pdf	uploads/f4172faf-b29a-4b96-ae6e-f213c4101c38.pdf	be084b420841c0d779ddbbfcb459e9bff8e4159acce31e52756eddd72673a0cf	2026-11-16 18:14:22.587518	\N	\N	17	1	1	\N
44	residencia.pdf	uploads/25d8b79a-f0c0-4711-aa5f-e185d51154ab.pdf	1071a9993dc4327f7a448269a929fd4393a3dfd959bdae341455933250e7ace7	2026-11-16 18:14:22.794903	\N	\N	17	2	1	\N
45	educacion_basica.pdf	uploads/147cfcd4-b28d-42b8-a718-90aff0122f59.pdf	6c1c5177ff2b6af17a4e091fc755642c5fab4652d14e81f089ab07d685c8e80b	2026-11-16 18:14:22.995541	\N	\N	17	3	1	\N
46	cedula.pdf	uploads/8d81b513-8446-458c-a168-8acaa47664e8.pdf	965a3b860b2ef439b032184aea0ca8ffa4df5f872fc93ec1389b56e0b7789578	2026-11-16 18:14:52.660816	\N	\N	18	1	1	\N
47	constancia_robo.pdf	uploads/94c1c018-7abe-4283-b405-22f0867c3e0e.pdf	06a9365d4ec210971c07221ca47af3e53838fa00bc1e16df31a346efea70a335	2026-11-16 18:14:52.901007	\N	\N	18	5	1	\N
48	cedula.pdf	uploads/029e2f3b-ab4d-4361-b4d2-c1ecf8d7e9af.pdf	01f1605ca10f6ea4d1ccc9a1fd9fb312cdb9055ac04b912b5448d68a85c23da6	2026-11-16 18:14:53.273433	\N	\N	19	1	1	\N
49	licencia_anterior.pdf	uploads/0d83a1fe-a39e-4cf4-b418-d215ef056dcc.pdf	394229c893fc16cf848b73eefd63f70b799529f88afedd1c778b104423a57d80	2026-11-16 18:14:53.477567	\N	\N	19	4	1	\N
35	licencia_anterior.pdf	uploads/3f994980-5097-4811-a769-655133a70f06.pdf	174628c1df7bcbf45082ac62f72bf4512e44957956526c2ee9ab1b319b913615	2026-11-16 18:14:19.91177	\N	2026-11-16 18:59:53.687728	13	4	2	12345678-5
34	cedula.pdf	uploads/481f29d0-4853-4523-b4ea-3ec7cc06087f.pdf	352f3b2007c267f40dee713467e50a98ab851f5fa348c824eb95ce38cd54e95e	2026-11-16 18:14:19.664316	asda	2026-11-16 19:01:28.003917	13	1	3	12345678-5
\.


--
-- Data for Name: estado_documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_documento (id_estado_documento, nombre_estado_documento) FROM stdin;
1	Pendiente
2	Aprobado
3	Rechazado
\.


--
-- Data for Name: estado_tramite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_tramite (id_estado_tramite, nombre_estado_tramite) FROM stdin;
1	Cita reservada
2	Examen teórico aprobado
3	Examen psicotécnico aprobado
4	Fotografía capturada
5	Licencia en impresión
6	Lista para retiro
7	Rechazado
8	Examen práctico aprobado
\.


--
-- Data for Name: estadodocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estadodocumento (idestadodocumento, nombreestadodocumento) FROM stdin;
1	Pendiente
2	Aprobado
3	Rechazado
\.


--
-- Data for Name: estadotramite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estadotramite (idestadotramite, nombreestadotramite) FROM stdin;
1	Cita reservada
2	Examen teórico aprobado
3	Examen psicotécnico aprobado
4	Fotografía capturada
5	Licencia en impresión
6	Lista para retiro
\.


--
-- Data for Name: historial_estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_estado (id_historial_estado, fecha, id_tramite, id_estado_tramite, rut_funcionario) FROM stdin;
27	2026-11-16 18:14:19.381795	13	1	\N
28	2026-11-16 18:14:20.103252	14	1	\N
29	2026-11-16 18:14:20.826806	14	2	12345678-5
30	2026-11-16 18:14:20.841297	14	3	12345678-5
31	2026-11-16 18:14:20.856517	14	8	12345678-5
32	2026-11-16 18:14:20.872408	14	4	12345678-5
33	2026-11-16 18:14:21.057473	15	1	\N
34	2026-11-16 18:14:21.564432	15	4	12345678-5
35	2026-11-16 18:14:21.580487	15	5	12345678-5
36	2026-11-16 18:14:21.587352	15	6	12345678-5
37	2026-11-16 18:14:21.749748	16	1	\N
38	2026-11-16 18:14:22.374663	17	1	\N
39	2026-11-16 18:14:52.394798	18	1	\N
40	2026-11-16 18:14:53.056958	19	1	\N
\.


--
-- Data for Name: historialestado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historialestado (idhistorialestado, fecha, idtramite, idestadotramite, rutfuncionario) FROM stdin;
\.


--
-- Data for Name: metodo_notificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.metodo_notificacion (id_metodo_notificacion, nombre_metodo_notificacion) FROM stdin;
1	Correo
2	WhatsApp
3	Correo y WhatsApp
\.


--
-- Data for Name: metodonotificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.metodonotificacion (idmetodonotificacion, nombremetodonotificacion) FROM stdin;
1	Correo
2	WhatsApp
\.


--
-- Data for Name: requiere; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requiere (id_tipo_tramite, id_tipo_documento) FROM stdin;
1	1
1	2
1	3
2	1
2	4
3	1
3	5
\.


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id_rol, nombre_rol) FROM stdin;
1	ciudadano
2	funcionario
3	administrador
\.


--
-- Data for Name: tipo_documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_documento (id_tipo_documento, nombre_tipo_documento) FROM stdin;
1	Cédula de identidad
2	Certificado de residencia
3	Certificado de educación básica
4	Licencia anterior
5	Constancia de denuncia por robo o extravío
\.


--
-- Data for Name: tipo_tramite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_tramite (id_tipo_tramite, nombre_tipo_tramite, duracion_min) FROM stdin;
1	Licencia (primera vez)	30
2	Renovación	20
3	Reimpresión	20
\.


--
-- Data for Name: tipodocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipodocumento (idtipodocumento, nombretipodocumento) FROM stdin;
1	Cédula de identidad
2	Certificado de residencia
3	Certificado de educación básica
4	Licencia anterior
5	Constancia de denuncia por robo o extravío
\.


--
-- Data for Name: tipotramite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipotramite (idtipotramite, nombretipotramite, duracionmin) FROM stdin;
1	Licencia (primera vez)	30
2	Renovación	20
3	Reimpresión	20
\.


--
-- Data for Name: tramite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tramite (id_tramite, fecha_inicio, rut_ciudadano, id_tipo_tramite, id_estado_tramite) FROM stdin;
13	2026-11-16 18:14:19.381795	17456321-7	2	1
14	2026-11-16 18:14:20.103252	16234789-6	1	4
15	2026-11-16 18:14:21.057473	19876543-0	3	6
16	2026-11-16 18:14:21.749748	15987234-3	2	1
17	2026-11-16 18:14:22.374663	20567891-3	1	1
18	2026-11-16 18:14:52.394798	18345672-5	3	1
19	2026-11-16 18:14:53.056958	14765289-5	2	1
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (rut, nombre, correo, telefono, clave_hash, activo, id_rol) FROM stdin;
12345678-5	Funcionario Prueba	funcionario@prueba.cl	\N	$2b$10$Cm5dvzMpMmK12ta.GFMzA.B/3XRuzoc4LA/nhl5c0bAkQeFfV38b2	t	2
11111111-1	Administrador Prueba	admin@prueba.cl	\N	$2b$10$Cm5dvzMpMmK12ta.GFMzA.B/3XRuzoc4LA/nhl5c0bAkQeFfV38b2	t	3
20123456-5	Ciudadano Prueba	tulicencia.santodomingo@gmail.com	+56911111111	$2b$10$Cm5dvzMpMmK12ta.GFMzA.B/3XRuzoc4LA/nhl5c0bAkQeFfV38b2	t	1
17456321-7	Camila Rojas Fuentes	camila.rojas@correo.cl	+56981456321	$2b$10$aIqqPmYuwdZh.fuRQe3qmeh4yVp0J8wWEDwAFW9Yine4cCN29JgjO	t	1
16234789-6	Matias Soto Carrasco	matias.soto@correo.cl	+56981234789	$2b$10$QJlpIBFAHnhXZ49vLF5Ky.6Sdfshfd5Ozsv2PD5yZA8pV.xq9/lui	t	1
19876543-0	Javiera Munoz Leiva	javiera.munoz@correo.cl	+56981876543	$2b$10$pnB3OfAS.szf/Cn7uxTXleh3D9k.f15lES9CnoTtqyduVA.4EH4Pu	t	1
15987234-3	Benjamin Diaz Araya	benjamin.diaz@correo.cl	+56981987234	$2b$10$1UP7495YLL.iB7X17Hw3TODy6ix413z8J0jm8/eifJK2vzbt4M8Ta	t	1
20567891-3	Antonia Vera Pizarro	antonia.vera@correo.cl	+56981567891	$2b$10$iPBDcdlZjpCJEOvAgGaM4uMgrRS3eaDjfWgsquEwzH3H8sle75x.m	t	1
18345672-5	Ignacio Fuentes Bravo	ignacio.fuentes@correo.cl	+56971834567	$2b$10$bXPN9A57aNo4DCcyFvXCVOg.etm9idM/9RZLMlt40gTRAp7zbZjkq	t	1
14765289-5	Paulina Reyes Castro	paulina.reyes@correo.cl	+56971476528	$2b$10$gjnb/i9LIakk9OiBCrUfF.km7GfMItyjio8.GqrNk9iEzr7uHtWZy	t	1
21644764-6	Rafael Valdes	rafael.valdes.s@mail.pucv.cl	+56995094852	$2b$10$TT/rtYH/jntqP7WKTWLCAeeXfVw0QGwcEzmK3L7cScgPAHvkOUIaG	t	1
\.


--
-- Name: bloque_horario_id_bloque_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bloque_horario_id_bloque_horario_seq', 229, true);


--
-- Name: bloquehorario_idbloquehorario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bloquehorario_idbloquehorario_seq', 3, true);


--
-- Name: cita_id_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cita_id_cita_seq', 25, true);


--
-- Name: documento_id_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documento_id_documento_seq', 60, true);


--
-- Name: estado_documento_id_estado_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_documento_id_estado_documento_seq', 3, true);


--
-- Name: estado_tramite_id_estado_tramite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_tramite_id_estado_tramite_seq', 8, true);


--
-- Name: estadodocumento_idestadodocumento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estadodocumento_idestadodocumento_seq', 3, true);


--
-- Name: estadotramite_idestadotramite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estadotramite_idestadotramite_seq', 6, true);


--
-- Name: historial_estado_id_historial_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_estado_id_historial_estado_seq', 47, true);


--
-- Name: historialestado_idhistorialestado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historialestado_idhistorialestado_seq', 1, false);


--
-- Name: metodo_notificacion_id_metodo_notificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodo_notificacion_id_metodo_notificacion_seq', 3, true);


--
-- Name: metodonotificacion_idmetodonotificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodonotificacion_idmetodonotificacion_seq', 2, true);


--
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_rol_seq', 3, true);


--
-- Name: tipo_documento_id_tipo_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_documento_id_tipo_documento_seq', 5, true);


--
-- Name: tipo_tramite_id_tipo_tramite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_tramite_id_tipo_tramite_seq', 3, true);


--
-- Name: tipodocumento_idtipodocumento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipodocumento_idtipodocumento_seq', 5, true);


--
-- Name: tipotramite_idtipotramite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipotramite_idtipotramite_seq', 3, true);


--
-- Name: tramite_id_tramite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tramite_id_tramite_seq', 24, true);


--
-- Name: bloque_horario bloque_horario_fecha_hora_inicio_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloque_horario
    ADD CONSTRAINT bloque_horario_fecha_hora_inicio_key UNIQUE (fecha, hora_inicio);


--
-- Name: bloque_horario bloque_horario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloque_horario
    ADD CONSTRAINT bloque_horario_pkey PRIMARY KEY (id_bloque_horario);


--
-- Name: bloquehorario bloquehorario_fecha_horainicio_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloquehorario
    ADD CONSTRAINT bloquehorario_fecha_horainicio_key UNIQUE (fecha, horainicio);


--
-- Name: bloquehorario bloquehorario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloquehorario
    ADD CONSTRAINT bloquehorario_pkey PRIMARY KEY (idbloquehorario);


--
-- Name: cita cita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_pkey PRIMARY KEY (id_cita);


--
-- Name: documento documento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento
    ADD CONSTRAINT documento_pkey PRIMARY KEY (id_documento);


--
-- Name: estado_documento estado_documento_nombre_estado_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_documento
    ADD CONSTRAINT estado_documento_nombre_estado_documento_key UNIQUE (nombre_estado_documento);


--
-- Name: estado_documento estado_documento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_documento
    ADD CONSTRAINT estado_documento_pkey PRIMARY KEY (id_estado_documento);


--
-- Name: estado_tramite estado_tramite_nombre_estado_tramite_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_tramite
    ADD CONSTRAINT estado_tramite_nombre_estado_tramite_key UNIQUE (nombre_estado_tramite);


--
-- Name: estado_tramite estado_tramite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_tramite
    ADD CONSTRAINT estado_tramite_pkey PRIMARY KEY (id_estado_tramite);


--
-- Name: estadodocumento estadodocumento_nombreestadodocumento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadodocumento
    ADD CONSTRAINT estadodocumento_nombreestadodocumento_key UNIQUE (nombreestadodocumento);


--
-- Name: estadodocumento estadodocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadodocumento
    ADD CONSTRAINT estadodocumento_pkey PRIMARY KEY (idestadodocumento);


--
-- Name: estadotramite estadotramite_nombreestadotramite_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadotramite
    ADD CONSTRAINT estadotramite_nombreestadotramite_key UNIQUE (nombreestadotramite);


--
-- Name: estadotramite estadotramite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadotramite
    ADD CONSTRAINT estadotramite_pkey PRIMARY KEY (idestadotramite);


--
-- Name: historial_estado historial_estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estado
    ADD CONSTRAINT historial_estado_pkey PRIMARY KEY (id_historial_estado);


--
-- Name: historialestado historialestado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialestado
    ADD CONSTRAINT historialestado_pkey PRIMARY KEY (idhistorialestado);


--
-- Name: metodo_notificacion metodo_notificacion_nombre_metodo_notificacion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_notificacion
    ADD CONSTRAINT metodo_notificacion_nombre_metodo_notificacion_key UNIQUE (nombre_metodo_notificacion);


--
-- Name: metodo_notificacion metodo_notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodo_notificacion
    ADD CONSTRAINT metodo_notificacion_pkey PRIMARY KEY (id_metodo_notificacion);


--
-- Name: metodonotificacion metodonotificacion_nombremetodonotificacion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodonotificacion
    ADD CONSTRAINT metodonotificacion_nombremetodonotificacion_key UNIQUE (nombremetodonotificacion);


--
-- Name: metodonotificacion metodonotificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodonotificacion
    ADD CONSTRAINT metodonotificacion_pkey PRIMARY KEY (idmetodonotificacion);


--
-- Name: requiere requiere_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requiere
    ADD CONSTRAINT requiere_pkey PRIMARY KEY (id_tipo_tramite, id_tipo_documento);


--
-- Name: rol rol_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_nombre_rol_key UNIQUE (nombre_rol);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- Name: tipo_documento tipo_documento_nombre_tipo_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT tipo_documento_nombre_tipo_documento_key UNIQUE (nombre_tipo_documento);


--
-- Name: tipo_documento tipo_documento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_documento
    ADD CONSTRAINT tipo_documento_pkey PRIMARY KEY (id_tipo_documento);


--
-- Name: tipo_tramite tipo_tramite_nombre_tipo_tramite_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_tramite
    ADD CONSTRAINT tipo_tramite_nombre_tipo_tramite_key UNIQUE (nombre_tipo_tramite);


--
-- Name: tipo_tramite tipo_tramite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_tramite
    ADD CONSTRAINT tipo_tramite_pkey PRIMARY KEY (id_tipo_tramite);


--
-- Name: tipodocumento tipodocumento_nombretipodocumento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipodocumento
    ADD CONSTRAINT tipodocumento_nombretipodocumento_key UNIQUE (nombretipodocumento);


--
-- Name: tipodocumento tipodocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipodocumento
    ADD CONSTRAINT tipodocumento_pkey PRIMARY KEY (idtipodocumento);


--
-- Name: tipotramite tipotramite_nombretipotramite_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipotramite
    ADD CONSTRAINT tipotramite_nombretipotramite_key UNIQUE (nombretipotramite);


--
-- Name: tipotramite tipotramite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipotramite
    ADD CONSTRAINT tipotramite_pkey PRIMARY KEY (idtipotramite);


--
-- Name: tramite tramite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tramite
    ADD CONSTRAINT tramite_pkey PRIMARY KEY (id_tramite);


--
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (rut);


--
-- Name: cita_vigente_unica; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cita_vigente_unica ON public.cita USING btree (id_tramite) WHERE vigente;


--
-- Name: cita cita_id_bloque_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_bloque_horario_fkey FOREIGN KEY (id_bloque_horario) REFERENCES public.bloque_horario(id_bloque_horario);


--
-- Name: cita cita_id_metodo_notificacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_metodo_notificacion_fkey FOREIGN KEY (id_metodo_notificacion) REFERENCES public.metodo_notificacion(id_metodo_notificacion);


--
-- Name: cita cita_id_tramite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_tramite_fkey FOREIGN KEY (id_tramite) REFERENCES public.tramite(id_tramite);


--
-- Name: documento documento_id_estado_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento
    ADD CONSTRAINT documento_id_estado_documento_fkey FOREIGN KEY (id_estado_documento) REFERENCES public.estado_documento(id_estado_documento);


--
-- Name: documento documento_id_tipo_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento
    ADD CONSTRAINT documento_id_tipo_documento_fkey FOREIGN KEY (id_tipo_documento) REFERENCES public.tipo_documento(id_tipo_documento);


--
-- Name: documento documento_id_tramite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento
    ADD CONSTRAINT documento_id_tramite_fkey FOREIGN KEY (id_tramite) REFERENCES public.tramite(id_tramite);


--
-- Name: documento documento_rut_revisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento
    ADD CONSTRAINT documento_rut_revisor_fkey FOREIGN KEY (rut_revisor) REFERENCES public.usuario(rut);


--
-- Name: historial_estado historial_estado_id_estado_tramite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estado
    ADD CONSTRAINT historial_estado_id_estado_tramite_fkey FOREIGN KEY (id_estado_tramite) REFERENCES public.estado_tramite(id_estado_tramite);


--
-- Name: historial_estado historial_estado_id_tramite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estado
    ADD CONSTRAINT historial_estado_id_tramite_fkey FOREIGN KEY (id_tramite) REFERENCES public.tramite(id_tramite);


--
-- Name: historial_estado historial_estado_rut_funcionario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estado
    ADD CONSTRAINT historial_estado_rut_funcionario_fkey FOREIGN KEY (rut_funcionario) REFERENCES public.usuario(rut);


--
-- Name: historialestado historialestado_idestadotramite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialestado
    ADD CONSTRAINT historialestado_idestadotramite_fkey FOREIGN KEY (idestadotramite) REFERENCES public.estadotramite(idestadotramite);


--
-- Name: requiere requiere_id_tipo_documento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requiere
    ADD CONSTRAINT requiere_id_tipo_documento_fkey FOREIGN KEY (id_tipo_documento) REFERENCES public.tipo_documento(id_tipo_documento);


--
-- Name: requiere requiere_id_tipo_tramite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requiere
    ADD CONSTRAINT requiere_id_tipo_tramite_fkey FOREIGN KEY (id_tipo_tramite) REFERENCES public.tipo_tramite(id_tipo_tramite);


--
-- Name: tramite tramite_id_estado_tramite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tramite
    ADD CONSTRAINT tramite_id_estado_tramite_fkey FOREIGN KEY (id_estado_tramite) REFERENCES public.estado_tramite(id_estado_tramite);


--
-- Name: tramite tramite_id_tipo_tramite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tramite
    ADD CONSTRAINT tramite_id_tipo_tramite_fkey FOREIGN KEY (id_tipo_tramite) REFERENCES public.tipo_tramite(id_tipo_tramite);


--
-- Name: tramite tramite_rut_ciudadano_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tramite
    ADD CONSTRAINT tramite_rut_ciudadano_fkey FOREIGN KEY (rut_ciudadano) REFERENCES public.usuario(rut);


--
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- PostgreSQL database dump complete
--

\unrestrict uZVwMrWnBHdU4X6X0EPZx15Xk7CHA3XmyYP5FGcCmtxQvFJdFhxadXTXfdJmkJb

