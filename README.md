# Proyecto_Final_INF3245

# 1. Descripción y alcance
Dentro de esta segunda entrega, se pasó el prototipo del frontend que tenía una sesión simulada, a un sistema con backend real, poniendo en foco lo que fue la seguridad, autenticación y control de acceso. Se construyó una API REST con Node.js, Express y PostgreSQL, además de conectarse el frontend en Ionic + React mediante Axios.
Específicamente se trabajaron los temas relacionados con la autenticación de los usuarios, el control de acceso definido por roles, la seguridad de los datos, la integración con el frontend y por último se dejó una colección de distintos casos de prueba y documentación, tanto exitosos como de error.

| Función | Ubicación | Estado |
|---|---|---|
| Registro de usuario | Ver [registro de usuarios](anexos/registro-de-usuarios.md) | Implementado |
| Inicio de sesión | [`POST /api/auth/login`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/authRoutes.js) | Implementado |
| Validación JWT y rutas protegidas | [`middlewares/authMiddleware.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/middlewares/authMiddleware.js) | Implementado |
| Autorización por roles | `autorizarRoles` y `autorizarPropioORoles` en [`authMiddleware.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/middlewares/authMiddleware.js) | Implementado |
| CRUD de trámites, citas, usuarios, bloques horarios y documentos | [`/api/tramites`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js), [`/api/citas`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/citaRoutes.js), [`/api/documentos`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/documentoRoutes.js), [`/api/bloques_horarios`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/bloqueHorarioRoutes.js), [`/api/usuarios`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/usuarioRoutes.js) | Implementado |
| Catálogos (tipos de estado, métodos de notificación y roles) | [`catalogoRoutes.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/catalogoRoutes.js): `/api/tipos_tramite`, `/api/tipos_documento`, `/api/estados_tramite`, `/api/estados_documento`, `/api/metodos_notificacion`, `/api/roles` | Implementado |
| Historial de estados del trámite | [`GET /api/tramites/:id`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js) | Implementado |
| Calendario | [`GET /api/bloques_horarios`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/bloqueHorarioRoutes.js), [`Calendario.jsx`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/Calendario.jsx) | Implementado |

# 2. Equipo, repositorio y trazabilidad
Nombre del equipo: Sistema de gestión de trámites en línea
Repositorio público:

https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea

Rama frontend: 

https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/tree/frontend-EP2

Rama backend: 

https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/tree/backend-EP2

Figma:

https://www.figma.com/design/GfTP09qFYtAsPHPTJxQtor/mockups?t=AJy5e1Ec4hsj2SAa-1

Integrantes y contribuciones

| Integrantes | Responsabilidad | Commits | Detalles |
|---|---|---|---|
| Rafael Valdes | EP 2.3 API REST y endpoints CRUD. | 22 | Pocos commits, pero grandes: el CRUD de todos los recursos y las colecciones de Insomnia |
| Diego Cortez | EP 2.4 Autenticación con JWT y roles. | 50 | La mayoría son ediciones del README desde GitHub. El login, el JWT y los roles están en pocos commits de código |
| Mauricio Morales | EP 2.5 Seguridad y validación de usuarios. | 41 | La mayoría son del frontend de la EP1. La validación de contraseñas y la seguridad del backend están en 3 commits |
| Cristóbal Flores | EP 2.6 Integración entre Ionic con React y el backend. | 94 | Un commit por cada paso: el servidor, la base de datos y cada pantalla conectada a la API |

La cantidad de commits no refleja por sí sola el trabajo de cada integrante: algunos suben cada avance por separado y otros agrupan un módulo completo en pocos commits. El conteo suma todas las ramas e incluye las ediciones hechas desde la web de GitHub.

| Requerimientos EP1| Endpoints |
|---|---|
| RF-1 : Selección de bloque horario | [`GET /api/bloques_horarios?fecha=`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/bloqueHorarioRoutes.js) |
| RF-2 : Registro de reserva de cita | [`POST /api/tramites`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js), [`POST /api/citas`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/citaRoutes.js) |
| RF-3 : Envío de comprobante de la cita | No implementado |
| RF-4 : Carga de documentación | [`POST /api/documentos`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/documentoRoutes.js) |
| RF-5 : Visualización de documentos adjuntos por el funcionario | [`GET /api/documentos?id_tramite=`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/documentoRoutes.js) |
| RF-6 : Validación de veracidad documental | [`PATCH /api/documentos/:id`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/documentoRoutes.js), [`PATCH /api/tramites/:id`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js) |
| RF-7 : Visualización de la línea de tiempo del trámite | [`GET /api/tramites/:id`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js) |
| RF-8 : Redirección por roles de usuario | [`POST /api/auth/login`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/authRoutes.js) |
| RF-9 : Notificación de licencia lista | No implementado |
| RF-10 : Despliegue de agenda diaria | [`GET /api/citas`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/citaRoutes.js), [`GET /api/tramites`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js) |
| RF-11 : Envío recordatorio de cita | No implementado |
| RF-12 : Cancelación de cita | [`PATCH /api/citas/:id`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/citaRoutes.js) |
| RF-13 : Búsqueda de trámites personal | [`GET /api/tramites?rut_ciudadano=`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js) |
| RF-14 : Historial de trámites | [`GET /api/tramites?rut_ciudadano=`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js), `GET /api/tramites/:id` |
| RF-15 : Emisión de comprobante | No implementado |
| RF-16 : Configuración de bloques horarios | [`POST/PUT/PATCH/DELETE /api/bloques_horarios`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/bloqueHorarioRoutes.js) |
| RF-17 : Gestión de cuentas de funcionarios | [`GET/PUT/PATCH/DELETE /api/usuarios`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/usuarioRoutes.js) |

# 3. Tecnologías
| Capa | Tecnología identificada |
|---|---|
| Servidor | Node.js + Express 5 |
| Base de datos | PostgreSQL |
| Autenticación | `jsonwebtoken` 9 (JWT firmado con HS256) |
| Seguridad | `bcrypt` (hash de contraseñas), `helmet` (cabeceras HTTP), `cors` (solo acepta el origen del frontend) y `dotenv` (secretos en `.env`) |
| Pruebas | Insomnia |
| Frontend | Ionic 9 + React 19 + React Router 6, con Vite 8 |
| Frontend/Backend | Axios 1 (HTTP + JSON, con token Bearer) |


# 4. Arquitectura y carpetas reales
**Backend** (rama `backend-EP2`)
```
backend
├── base de datos
│   └── licencias.sql        script de la base (tablas, catálogos y datos de prueba)
├── package-lock.json
├── package.json
├── pruebas                  colecciones de Insomnia
├── scripts                  generar hash de contraseñas (solo por la rúbrica)
└── src
    ├── app.js               arranque de Express, middlewares globales y rutas
    ├── config               conexión a PostgreSQL
    ├── controllers          reciben la petición, validan y responden
    ├── middlewares          token JWT, roles y logger
    ├── routes               endpoints de cada recurso
    ├── services             consultas SQL parametrizadas
    └── utils                validaciones, JWT y contraseñas
```

**Frontend** (rama `frontend-EP2`)
```
frontend
├── index.html
├── package.json
├── vite.config.js
└── src
    ├── App.jsx              rutas públicas, con sesión y por rol
    ├── main.jsx             punto de entrada
    ├── assets               imágenes e íconos
    ├── components           NavBar y barra de progreso
    ├── pages                una pantalla por archivo (con su .css)
    ├── routes               ProtectedRoute
    ├── services             cliente Axios, sesión y un servicio por recurso
    ├── styles               estilos globales
    └── utils                fechas y etapas de cada tipo de trámite
```

**Flujo de una petición**
```
Ionic + React (localhost:5173)
  página → servicio → api.js (Axios: agrega Bearer JWT y traduce errores)
      │  HTTP + JSON
      ▼
Express (localhost:3000/api)
  ruta → middleware (token y rol) → controlador → servicio → PostgreSQL (licencias)
```

# 5. Preparación y ejecución local del ejemplo
## 5.1 Requisitos previos
- Node.js 20.19 o superior (probado con Node 24) y npm
- PostgreSQL (con pgAdmin)
- Insomnia, para las pruebas de la API
- Git

El backend y el frontend están en ramas distintas, así que se clonan por separado:
```bash
git clone -b backend-EP2 https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea.git backend-EP2
git clone -b frontend-EP2 https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea.git frontend-EP2
```

## 5.2 Base de datos
1. Crear la base `licencias`: en pgAdmin, clic derecho en *Databases* → *Create* → *Database…*, o ejecutar `create database licencias;` conectado a la base `postgres` (o a cualquier otra base existente).
2. Abrir el *Query Tool* **sobre la base `licencias`**, cargar [`backend/base de datos/licencias.sql`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/base%20de%20datos/licencias.sql) y ejecutarlo completo. La línea `create database` del script está comentada a propósito: el script solo crea las tablas en la base abierta.

El script crea las tablas, los catálogos, tres usuarios de prueba y los bloques horarios de los próximos 7 días hábiles desde el día en que se ejecuta. Se puede volver a ejecutar para dejar la base desde cero.

| Rol | RUT | Contraseña |
|---|---|---|
| Ciudadano | `20123456-5` | `Clave123!` |
| Funcionario | `12345678-5` | `Clave123!` |
| Administrador | `11111111-1` | `Clave123!` |

## 5.3 Iniciar Backend
En `backend-EP2/backend/`, copiar `.env.ejemplo` como `.env` y completar los valores:

| Variable | Qué es | Ejemplo |
|---|---|---|
| `DB_HOST`, `DB_PORT` | Servidor de PostgreSQL | `localhost`, `5432` |
| `DB_NAME` | Base de datos | `licencias` |
| `DB_USER`, `DB_PASSWORD` | Usuario y contraseña de PostgreSQL | `postgres`, la de cada uno |
| `JWT_SECRET` | Clave para firmar los tokens (una cadena larga y aleatoria) | — |
| `JWT_EXPIRES_IN` | Duración del token | `2h` |

En una **primera terminal**:
```bash
cd backend-EP2/backend
npm install
npm run dev
```
La API queda en `http://localhost:3000/api` y la consola muestra "Conectado a PostgreSQL". Esta terminal debe quedar abierta.

## 5.4 Iniciar Frontend
En una **segunda terminal**, sin cerrar la del backend:
```bash
cd frontend-EP2/frontend
npm install
npm run dev
```
La aplicación queda en `http://localhost:5173`. Por defecto usa la API en `http://localhost:3000/api`. Para otra dirección, definir `VITE_API_URL` en un archivo `.env` del frontend.

## 5.5 Problemas frecuentes
| Síntoma | Qué revisar |
|---|---|
| "No se pudo conectar con el servidor" en la app | Que el backend esté corriendo en el puerto 3000 |
| Error de conexión a PostgreSQL al iniciar el backend | Que el servicio de PostgreSQL esté activo y los datos del `.env` sean correctos |
| `relation ... does not exist` | El script se ejecutó en otra base (por ejemplo `postgres`) en vez de `licencias` |
| Error de CORS en el navegador | El frontend debe estar en el puerto 5173. Si Vite usa otro (5174), es porque el 5173 está ocupado |
| "No hay horas disponibles" en todos los días | Los bloques se generan para 7 días hábiles desde que se creó la base. Volver a ejecutar `licencias.sql` |
| La sesión se cierra sola | El token dura 2 horas (`JWT_EXPIRES_IN`). Volver a iniciar sesión |

# 6. Documentación de la API existente
**URL base:** `http://localhost:3000/api`  
**Tipo de contenido:** `application/json`  
**Autenticación:** cabecera `Authorization: Bearer <token>`, con el token que entrega el login.

Las respuestas exitosas vienen en `{ "datos": ... }` y los errores en `{ "error": { "estado", "mensaje", "detalles" } }`. Personal = funcionario o administrador.

| Método | Ruta | Objetivo | Token / rol | Estado actual |
|---|---|---|---|---|
| POST | `/auth/registro` | Alta de usuarios (ciudadano o funcionario) | Administrador | Implementado |
| POST | `/auth/login` | Iniciar sesión (acceso ciudadano o funcionario) | No | Implementado, JWT de 2 h |
| GET | `/tipos_tramite`, `/tipos_documento`, `/estados_tramite`, `/estados_documento`, `/metodos_notificacion`, `/roles` | Catálogos | No | Implementado, solo lectura |
| GET | `/tramites` | Listar trámites | Sí (el ciudadano solo ve los suyos) | Implementado |
| GET | `/tramites/:id` | Ver trámite con su historial | Sí (el ciudadano solo los suyos) | Implementado |
| POST | `/tramites` | Crear trámite | Sí (el ciudadano solo a su nombre) | Implementado |
| PUT / PATCH | `/tramites/:id` | Editar o cambiar estado | Personal | Implementado |
| DELETE | `/tramites/:id` | Eliminar trámite sin citas ni documentos | Personal | Implementado |
| GET | `/citas` | Listar citas | Sí (el ciudadano solo ve las suyas) | Implementado |
| GET | `/citas/:id` | Ver cita | Sí (el ciudadano solo las suyas) | Implementado |
| POST | `/citas` | Reservar cita | Sí (el ciudadano solo en sus trámites) | Implementado |
| PUT / PATCH | `/citas/:id` | Reagendar o cancelar | Sí (el ciudadano solo las suyas) | Implementado |
| DELETE | `/citas/:id` | Eliminar cita | Personal | Implementado |
| GET | `/documentos`, `/documentos/:id` | Listar o ver documentos | Sí (el ciudadano solo los de sus trámites) | Implementado |
| POST | `/documentos` | Registrar documento PDF | Sí (el ciudadano solo en sus trámites) | Implementado |
| PUT / PATCH | `/documentos/:id` | Aprobar o rechazar | Personal | Implementado |
| DELETE | `/documentos/:id` | Eliminar documento pendiente | Sí (el ciudadano solo los de sus trámites) | Implementado |
| GET | `/bloques_horarios`, `/bloques_horarios/:id` | Ver horarios y cupos | Sí | Implementado |
| POST, PUT, PATCH, DELETE | `/bloques_horarios`, `/bloques_horarios/:id` | Administrar horarios | Personal | Implementado |
| GET | `/usuarios` | Listar usuarios | Personal | Implementado |
| GET | `/usuarios/:rut` | Ver usuario | Sí (propio o personal) | Implementado |
| PUT, PATCH, DELETE | `/usuarios/:rut` | Editar o eliminar usuario | Administrador | Implementado |

### 6.1 `POST /api/auth/registro` — Alta de usuarios por el administrador
En este sistema el ciudadano no crea su propia cuenta: la habilita la municipalidad. Por eso el registro solo lo puede usar un administrador con sesión iniciada (`Authorization: Bearer <token del administrador>`).

```json
{
  "rut": "15555555-5",
  "nombre": "Ciudadana Nueva",
  "correo": "nueva@prueba.cl",
  "telefono": "+56911111111",
  "password": "Segura#2026",
  "rol": "ciudadano"
}
```
Responde `201` con el usuario creado, sin la contraseña. `rol` puede ser `ciudadano` o `funcionario`; si no se envía, queda como ciudadano. No se pueden crear administradores.

**Estados reconocidos en el código:** `401` sin token o con token inválido; `403` si quien lo usa no es administrador; `400` si faltan datos, el rol no es válido o la contraseña no cumple las reglas (8 caracteres, mayúscula, minúscula, número y símbolo); `409` si el RUT o el correo ya existen.

### 6.2 `POST /api/auth/login` — Inicio de sesión
```json
{ "rut": "20123456-5", "password": "Clave123!", "acceso": "ciudadano" }
```
`acceso` indica desde qué pantalla se inicia sesión: `ciudadano` (simulador de ClaveÚnica) o `funcionario` (acceso del personal). Es opcional; si se envía y el rol del usuario no corresponde, responde `403`. Por el acceso `funcionario` entran funcionarios y administradores.

Respuesta de éxito:
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "token": "<JWT>",
  "datos": { "rut": "20123456-5", "nombre": "Ciudadano Prueba", "rol": "ciudadano" }
}
```
El token solo lleva `rut` y `rol`.

**Estados reconocidos en el código:** `400` si faltan credenciales o el acceso no es válido; `401` con el mismo mensaje para un RUT inexistente o una contraseña incorrecta; `403` si el rol no corresponde al acceso.

### 6.3 Rutas protegidas — ejemplo `POST /api/citas`
```
POST /api/citas HTTP/1.1
Authorization: Bearer <JWT>
Content-Type: application/json

{ "id_tramite": 1, "id_bloque_horario": 1, "id_metodo_notificacion": 1 }
```
Responde `201` con la cita creada.

**Respuestas de error comunes a todas las rutas protegidas:** `401` si falta el token, es inválido o expiró; `403` si el rol no tiene permiso; `400` si los datos no son válidos; `404` si el recurso no existe; `409` si hay conflicto con los datos guardados (por ejemplo, bloque sin cupos o cita vigente repetida).

**Usuarios de prueba** (`licencias.sql`, contraseña `Clave123!`): ciudadano `20123456-5`, funcionario `12345678-5` y administrador `11111111-1`.
### 6.4 Parámetros por recurso
Los filtros van en la URL (`?campo=valor`) y los datos en el cuerpo JSON. `PUT` reemplaza el recurso con todos sus campos editables y `PATCH` cambia solo los que se envían.

| Recurso | Filtros de `GET` | Cuerpo de `POST` | Campos editables (`PUT` / `PATCH`) |
|---|---|---|---|
| `/tramites` | `rut_ciudadano`, `id_tipo_tramite`, `id_estado_tramite` | `rut_ciudadano`, `id_tipo_tramite` | `id_tipo_tramite`, `id_estado_tramite` |
| `/citas` | `fecha`, `rut_ciudadano`, `id_bloque_horario`, `vigente` | `id_tramite`, `id_bloque_horario`, `id_metodo_notificacion` | `id_bloque_horario`, `id_metodo_notificacion`, `vigente` |
| `/documentos` | `id_tramite`, `id_estado_documento` | `id_tramite`, `id_tipo_documento`, `nombre_archivo` | `nombre_archivo`, `id_estado_documento`, `motivo_rechazo`, `rut_revisor` |
| `/bloques_horarios` | `fecha`, `activo` | `fecha`, `hora_inicio`, `hora_fin`, `cupos`, `activo` (opcional) | `fecha`, `hora_inicio`, `hora_fin`, `cupos`, `activo` |
| `/usuarios` | `id_rol`, `activo` | No tiene `POST` (las cuentas se crean con `/auth/registro`) | `nombre`, `correo`, `telefono`, `activo`, `id_rol` |

Los campos que no aparecen en la tabla se rechazan con `400`.

# 7. Seguridad y JWT: estado y correcciones necesarias
| Control EP2 | Estado en este proyecto | Evidencia | Mejora pendiente |
|---|---|---|---|
| JWT con expiración | Sí. El token se firma con HS256 y dura 2 horas por defecto, configurable con `JWT_EXPIRES_IN`. | `utils/jwt.js` | Definir con el grupo si 2 h es adecuado |
| Claims mínimos en el JWT | Sí. El token solo lleva `rut` y `rol`, sin contraseña ni datos personales. | `authController.js` | Ninguna |
| Rutas protegidas en backend | Sí. Usuarios, trámites, citas, documentos y bloques horarios exigen token válido y responden 401 si falta o expiró. | `middlewares/authMiddleware.js`, archivos `*Routes.js` | Los catálogos son públicos a propósito (solo lectura) |
| Roles diferenciados | Sí. Hay tres roles (ciudadano, funcionario, administrador) con los middlewares `autorizarRoles` y `autorizarPropioORoles`, que responden 403. El rol lo asigna siempre el servidor al registrar. Un ciudadano solo puede ver o modificar sus propios trámites, citas y documentos. | `authMiddleware.js`, `authService.js` | Ninguna |
| bcrypt | Sí. Las contraseñas de la base están guardadas como hash bcrypt (10 rondas), y el login las verifica con `bcrypt.compare`. `npm run hash` genera hashes del mismo tipo (ver [registro de usuarios](anexos/registro-de-usuarios.md)). | `utils/claves.js`, `authController.js` | Ninguna |
| Secretos en variables de entorno | Sí. `JWT_SECRET` y las credenciales de PostgreSQL se leen desde `.env`. En el repositorio solo está `.env.ejemplo`. | `utils/jwt.js`, `config/db.js`, `.env.ejemplo` | Exigir un largo mínimo a `JWT_SECRET` |
| Validación de entradas | Sí. Se validan RUT, nombre, correo, teléfono, id, fechas y largos máximos, y se rechazan campos desconocidos. En el login, la contraseña se verifica contra su hash con `bcrypt.compare`. La validación de contraseña segura (`validarClave`) se mantiene solo por la rúbrica (ver [registro de usuarios](anexos/registro-de-usuarios.md)). | `utils/apoyoControladores.js`, `utils/validacionClave.js` | Opcional: usar una librería de validación |
| Prevención de SQL injection | Sí. Todas las consultas usan parámetros (`$1`, `$2`). | `services/*.js` | Ninguna |
| Minimización de datos | Sí. Ninguna respuesta incluye `clave_hash` y el JWT no lleva datos sensibles. | `authService.js`, `usuarioService.js` | Ninguna |
| Protección de rutas frontend | Sí. `ProtectedRoute` exige sesión en las rutas privadas y rol de personal en las del funcionario, y redirige a `/login` o a `/`. Al entrar a cada página revisa si el token venció, y un 401 cierra la sesión (ver 8.2 y 8.3). | `routes/ProtectedRoute.jsx`, `services/sesion.js`, `services/api.js` | Guardar el token en cookies `httpOnly` en vez de `localStorage` |
| Manejo de errores | Sí. Un manejador central responde 500 genérico y registra el detalle solo en consola. El login da el mismo mensaje para un RUT inexistente y una contraseña mala, y una petición sin cuerpo responde 400. | `app.js`, `authController.js` | Opcional: límite de intentos de login |
| Pruebas de seguridad | Pruebas en Insomnia de casos de éxito y de error: login, registro con contraseña débil, registro repetido y rutas con y sin token. | `pruebas/insomnia-auth.json` | Ninguna |

# 8. Integración frontend-backend
El frontend ([rama `frontend-EP2`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/tree/frontend-EP2/frontend)) consume esta API con **Axios**. Todas las pantallas obtienen sus datos del backend, y ya no quedan datos escritos en el código.

## 8.1 Cliente HTTP y servicios
El frontend se comunica con la API mediante un cliente Axios y un servicio por recurso.

| Pieza | Qué hace |
|---|---|
| Cliente ([`api.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/api.js)) | Instancia única de Axios con `baseURL` (`VITE_API_URL` o `http://localhost:3000/api`) y un timeout de 10 s |
| Servicios ([`src/services/`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/tree/frontend-EP2/frontend/src/services)) | Un archivo por recurso (trámites, citas, documentos, bloques, catálogos y sesión). Las funciones devuelven directamente los `datos` de la respuesta |
| Páginas | No escriben URLs ni usan Axios directamente: solo llaman a los servicios. Si cambia una ruta del backend, se corrige en un solo archivo |

Se eligió Axios en vez de `fetch` porque trae interceptores (ver 8.2 y 8.4), convierte el JSON automáticamente y permite enviar los filtros como `params`. La lista completa de servicios y endpoints está en la 8.6.

## 8.2 Envío del JWT y manejo de la sesión
La sesión se maneja en [`services/sesion.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/sesion.js) y en los interceptores de [`services/api.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/api.js).

| Momento | Qué hace el frontend |
|---|---|
| Inicio de sesión | `login` guarda en `localStorage` el token y los datos del usuario (`rut`, `nombre`, `rol`) con `guardarSesion` |
| Cada petición | El interceptor de petición agrega `Authorization: Bearer <token>` si hay sesión, así ninguna pantalla lo envía a mano |
| Token vencido | `getToken` lee el `exp` del JWT. Si ya venció, borra la sesión y no envía el token |
| Respuesta 401 | El interceptor de respuesta borra la sesión y redirige a `/login` (salvo en el propio login, donde 401 significa "clave incorrecta") |
| Cerrar sesión | El botón "Cerrar sesion" del menú llama a `logout`, que borra el token y los datos guardados |

El token dura 2 horas (`JWT_EXPIRES_IN` del backend). Se eligió `localStorage` por simplicidad y porque la sesión se mantiene al recargar la página. Una alternativa más segura frente a XSS serían las cookies `httpOnly`, que quedan como mejora.

## 8.3 Protección de rutas por rol
Las rutas se protegen con [`routes/ProtectedRoute.jsx`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/routes/ProtectedRoute.jsx), aplicado en [`App.jsx`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/App.jsx).

| Rutas | Quién puede entrar | Si no cumple |
|---|---|---|
| `/`, `/login` | Cualquiera (públicas) | — |
| `/tramite-licencia`, `/calendario`, `/tramite-finalizado`, `/mis-tramites` | Cualquier usuario con sesión | Sin sesión → `/login` |
| `/funcionario/agenda`, `/funcionario/tramites/:idTramite` | Funcionario o administrador | Sin sesión → `/login`, ciudadano → `/` |

Al iniciar sesión, cada rol llega a su pantalla (RF-8): el personal a `/funcionario/agenda` y el ciudadano a `/`, y el menú muestra solo las opciones de su rol. `ProtectedRoute` vuelve a leer la sesión cada vez que se entra a una página, así un token vencido saca al usuario aunque la página siga montada. Esta protección es de interfaz: la seguridad real está en el backend, que valida el token y el rol en cada petición (ver sección 7).

## 8.4 Manejo de errores
El interceptor de respuesta de [`api.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/api.js) convierte cualquier error en un `Error` con `.mensaje` (texto para el usuario) y `.status` (código HTTP), así todas las pantallas lo manejan igual.

| Caso | Qué ve el usuario |
|---|---|
| Backend no disponible | "No se pudo conectar con el servidor. Revisa tu conexión o inténtalo nuevamente." |
| Sin respuesta en 10 s | "El servidor tardó demasiado en responder. Intenta de nuevo." |
| Error con mensaje del backend (`{ error: { mensaje, detalles } }`) | Ese mensaje, por ejemplo "El bloque horario no tiene cupos disponibles" |
| 401 | Se cierra la sesión y vuelve al login (ver 8.2) |
| 403 / 404 sin mensaje | "No tienes permiso para hacer esto." / "No se encontró lo que buscabas." |
| 500 o más | "Hubo un problema en el servidor. Intenta más tarde." |

En las pantallas, mientras se cargan los datos se muestra un spinner. Si falla la carga, el mensaje aparece en lugar del contenido, y si no hay datos se indica (por ejemplo "No hay horas disponibles este día"). Los errores de acciones se muestran en rojo: junto al botón en la reserva, o en un aviso al cancelar, reagendar, aprobar o rechazar. Si una reserva falla a medio camino, al reintentar se reutilizan el trámite y los documentos ya creados, sin duplicarlos.

## 8.5 Flujos con datos reales
Todas las pantallas leen y guardan sus datos en el backend.

| Pantalla | Qué hace | Servicios que usa | RF |
|---|---|---|---|
| [Login](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/Login.jsx) | Inicia sesión y redirige según el rol | [`authService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/authService.js) | RF-8 |
| [Trámite de licencia](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/TramiteLicencia.jsx) | Muestra los tipos de trámite con sus documentos, las horas de los próximos 7 días y los métodos de aviso. "Continuar" crea el trámite, registra los documentos y reserva la cita | [`catalogoService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/catalogoService.js), [`bloqueHorarioService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/bloqueHorarioService.js), [`tramiteService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/tramiteService.js), [`documentoService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/documentoService.js), [`citaService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/citaService.js) | RF-1, RF-2, RF-4 |
| [Calendario](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/Calendario.jsx) | Muestra los bloques de cualquier fecha con sus cupos. También se usa para reagendar una cita | [`bloqueHorarioService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/bloqueHorarioService.js), [`citaService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/citaService.js) | RF-1 |
| [Trámite finalizado](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/TramiteFinalizado.jsx) | Muestra los datos de la reserva recién hecha (recibidos de la pantalla anterior, sin nueva petición) | — | RF-2 |
| [Mis trámites](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/MisTramites.jsx) | Lista los trámites y citas propios con su avance, y permite cancelar, reagendar y ver el historial | [`tramiteService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/tramiteService.js), [`citaService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/citaService.js) | RF-7, RF-12, RF-14 |
| [Agenda (funcionario)](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/AgendaFuncionario.jsx) | Lista todas las citas con su trámite, con filtros por estado y tipo, y búsqueda por RUT o nombre | [`citaService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/citaService.js), [`tramiteService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/tramiteService.js), [`catalogoService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/catalogoService.js) | RF-10, RF-13 |
| [Proceso del trámite (funcionario)](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/AgendaProceso.jsx) | Muestra el trámite, sus documentos y el historial del ciudadano, y permite aprobar, avanzar de etapa o rechazar | [`tramiteService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/tramiteService.js), [`documentoService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/documentoService.js), [`citaService`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/citaService.js) | RF-5, RF-6, RF-14 |

Simulado por ahora: la carga de documentos guarda solo el nombre del archivo (el PDF no se sube al servidor) y el botón "Descargar comprobante".

## 8.6 Servicios y endpoints
Qué endpoint llama cada servicio. Junto con la 8.5 se lee la cadena completa: pantalla → servicio → endpoint.

| Servicio | Funciones | Endpoints |
|---|---|---|
| [`authService.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/authService.js) | `login`, `logout` | [`POST /auth/login`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/authRoutes.js) |
| [`catalogoService.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/catalogoService.js) | `listarTiposTramite`, `listarMetodosNotificacion`, `listarEstadosTramite` | [`GET /tipos_tramite`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/catalogoRoutes.js), [`GET /metodos_notificacion`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/catalogoRoutes.js), [`GET /estados_tramite`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/catalogoRoutes.js) |
| [`bloqueHorarioService.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/bloqueHorarioService.js) | `listarBloquesPorFecha` | [`GET /bloques_horarios?fecha&activo=true`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/bloqueHorarioRoutes.js) |
| [`tramiteService.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/tramiteService.js) | `crearTramite`, `listarTramites`, `obtenerTramite`, `cambiarEstadoTramite` | [`POST /tramites`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js), [`GET /tramites`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js), [`GET /tramites/:id`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js), [`PATCH /tramites/:id`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/tramiteRoutes.js) |
| [`citaService.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/citaService.js) | `crearCita`, `listarCitas`, `listarCitasVigentes`, `cancelarCita`, `reagendarCita` | [`POST /citas`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/citaRoutes.js), [`GET /citas`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/citaRoutes.js), [`PATCH /citas/:id`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/citaRoutes.js) |
| [`documentoService.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/services/documentoService.js) | `crearDocumento`, `listarDocumentos` | [`POST /documentos`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/documentoRoutes.js), [`GET /documentos?id_tramite`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/documentoRoutes.js) |

Las rutas no incluyen `/api` porque ya va en el `baseURL`.


# 9. Pruebas funcionales y evidencia EP2
Las pruebas están en [`backend/pruebas/`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/tree/backend-EP2/backend/pruebas): una colección de Insomnia por recurso, una de autenticación y roles, y una del registro por el administrador. Para repetirlas, se carga la base desde `licencias.sql`, se importan las colecciones en Insomnia y se ejecutan en este orden: catálogos, bloques horarios, trámites, citas, documentos, autenticación, registro por administrador y usuarios (usuarios va al final porque su petición 15 elimina al administrador de prueba).

| ID | Petición / escenario | HTTP esperado | Evidencia |
|---|---|---|---|
| P01 | Administrador registra un ciudadano | 201 | `insomnia-auth.json` #01, [captura](anexos/pruebas/caso-auth-01.png) |
| P02 | Registrar RUT repetido | 409 | `insomnia-auth.json` #02, [captura](anexos/pruebas/auth-resultados.png) |
| P03 | Registrar con contraseña débil | 400 | `insomnia-auth.json` #04, [captura](anexos/pruebas/caso-auth-04.png) |
| P04 | Iniciar sesión válida | 200 | `insomnia-auth.json` #06, [captura](anexos/pruebas/caso-auth-06.png) |
| P05 | Login sin credenciales | 400 | `insomnia-auth.json` #07, [captura](anexos/pruebas/auth-resultados.png) |
| P06 | Login con contraseña incorrecta | 401 | `insomnia-auth.json` #08, [captura](anexos/pruebas/auth-resultados.png) |
| P07 | Ruta protegida sin token | 401 | `insomnia-auth.json` #10, [captura](anexos/pruebas/caso-auth-10.png) |
| P08 | Ruta protegida con token inválido | 401 | `insomnia-auth.json` #11, [captura](anexos/pruebas/auth-resultados.png) |
| P09 | Ciudadano entra a una ruta de personal | 403 | `insomnia-auth.json` #16, [captura](anexos/pruebas/auth-resultados.png) |
| P10 | Ciudadano cancela la cita de otro | 403 | `insomnia-auth.json` #22, [captura](anexos/pruebas/caso-auth-22.png) |
| P11 | CRUD de trámites: GET, POST, PUT, PATCH y DELETE | 200 / 201 | `insomnia-tramites.json` #01–#15, [captura](anexos/pruebas/tramites-resultados.png) |
| P12 | Recurso que no existe | 404 | `insomnia-tramites.json` #07, [captura](anexos/pruebas/tramites-resultados.png) |
| P13 | Datos inválidos | 400 | `insomnia-bloques-horarios.json` #08, [captura](anexos/pruebas/bloques-horarios-resultados.png) |
| P14 | Reservar en un bloque sin cupos | 409 | `insomnia-citas.json` #07, [captura](anexos/pruebas/caso-citas-07.png) |
| P15 | Eliminar un documento ya revisado | 409 | `insomnia-documentos.json` #17, [captura](anexos/pruebas/caso-documentos-17.png) |
| P16 | Ciudadano accede al trámite, la cita o los documentos de otro | 403 | `insomnia-auth.json` #25–#30, [captura](anexos/pruebas/auth-resultados.png) |
| P17 | Registrar sin token | 401 | `insomnia-registro-admin.json` #03, [captura](anexos/pruebas/caso-registro-03.png) |
| P18 | Ciudadano intenta registrar un usuario | 403 | `insomnia-registro-admin.json` #05, [captura](anexos/pruebas/caso-registro-05.png) |
| P19 | Administrador registra un funcionario | 201 | `insomnia-registro-admin.json` #02, [captura](anexos/pruebas/caso-registro-02.png) |
| P20 | Iniciar sesión por el acceso que no corresponde al rol | 403 | `insomnia-registro-admin.json` #09–#10, [captura](anexos/pruebas/caso-registro-09.png) |
| P21 | Iniciar sesión por el acceso que corresponde al rol (administrador por funcionario, ciudadano por ciudadano) | 200 | `insomnia-registro-admin.json` #00 y #04, capturas [administrador](anexos/pruebas/caso-login-admin.png) y [ciudadano](anexos/pruebas/caso-login-ciudadano.png) |

Las colecciones tienen 142 peticiones en total, con casos de éxito y de error para cada recurso. Se ejecutaron todas el 22-10-2026 con la base recién cargada y en el orden indicado, y cada una respondió el código esperado que indica su nombre.

Capturas de cada colección: [autenticación](anexos/pruebas/auth-resultados.png), [catálogos](anexos/pruebas/catalogos-resultados.png), [bloques horarios](anexos/pruebas/bloques-horarios-resultados.png), [trámites](anexos/pruebas/tramites-resultados.png), [documentos](anexos/pruebas/documentos-resultados.png), [citas](anexos/pruebas/citas-resultados.png), [registro por administrador](anexos/pruebas/registro-admin-resultados.png) y [usuarios](anexos/pruebas/usuarios-resultados.png).

# 10. Modelo relacional
Base de datos PostgreSQL, con las distintas claves primarias, claves foráneas y restricciones.
### Esquema relacional
![Esquema relacional de la base de datos licencias](anexos/esquema-relacional.png)
### Modelo Entidad-Relación
![Modelo entidad-relación de la base de datos licencias](anexos/modelo-entidad-relacion.png)

# 11. Matriz de cumplimiento EP2
| Criterio | Evidencia exigida | Estado |
|---|---|---|
| EP 2.1 Servidor | Ejecutable, módulos, instalación | Implementado |
| EP 2.2 Base relacional | Modelo consistente, FK, SQL reproducible, conexión | Implementado |
| EP 2.3 API REST | GET, POST, PUT/PATCH y DELETE, con JSON y HTTP | Implementado |
| EP 2.4 JWT y roles | Registro, login, expiración, rutas y roles | Implementado |
| EP 2.5 Seguridad | bcrypt, validación, secretos, SQL parametrizado | Implementado |
| EP 2.6 Ionic React + backend | Consumo real mediante React, JWT y errores | Implementado |
| EP 2.7 Pruebas | Postman/Insomnia y errores | Implementado |
| Documentación | README, ramas, integrantes, commits | Implementado |

La tabla no asigna una calificación: solo relaciona el contenido del proyecto con los criterios que deben demostrarse.

# 12. Referencias
- [Ionic Framework](https://ionicframework.com/docs)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [JSON Web Tokens](https://jwt.io/)
- [Axios](https://axios.rest/)
- [Insomnia](https://developer.konghq.com/insomnia/)
