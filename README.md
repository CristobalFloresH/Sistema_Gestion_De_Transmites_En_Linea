# Proyecto_Final_INF3245

# 1. Descripción y alcance
Dentro de esta segunda entrega, se paso el prototipo del frontend que tenia una sesion simulada, a un sistema con backend real, poniendo en foco lo que fue la seguridad, autenticacion y conttrol de acceso. Se construyo una API REST con Node.js, Express y PostgreSQL ademas de conectarse el frontend en Ionic + Reac mediante Axios.
Específicamente se trabajaron los temas relacionas con la autenticación de los usuarios, el control de acceso definido por roles, la seguridad de los datos, la integración con el frontend y por ultimo se dejo una colección de distintos casos de pruebas y documentación siendo tanto exitosos cómo de error.

| Función | Ubicación |Estado en el ejemplo | 
|---|---|---|
| Registro de usuario | --- | No implementado |
| Inicio de sesion |   | Implementado |
| Validacion JTW y rutas protegidas |  | Implementado |
| Autorizacion por roles |  | Implementado |
| CRUD de tramites, citas, usuarios, bloques horarios y documentos|  | Implementado |
| Catalogos (tipos de estado, metodos de notificacion, roles|  | Implementado |
| Historial de estados del tramite|  | Implementado |
| Calendario|  | Implementado |

# 2. Equipo, repositorio y trazabilidad
Nombre del equipo: Sistema de gestión de tramites en linea
Repositorio público:

https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea

Rama frontend: 

https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/tree/frontend-EP2

Rama backend: 

https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/tree/backend-EP2

Figma:

https://www.figma.com/design/GfTP09qFYtAsPHPTJxQtor/mockups?t=AJy5e1Ec4hsj2SAa-1

Integrantes y contribuciones

| Integrantes | Responsabilidad | Evidencia de colaboracion |
|---|---|---|
| Rafael Valdes | EP 2.3 API REST y endpoints CRUD. |  | 
| Diego Cortez | EP 2.4 Autenticaci´on con JWT y roles. |  | 
| Mauricio Morales | EP 2.5 Seguridad y validaci´on de usuarios. |  | 
| Cristóbal Flores | EP 2.6 Integraci´on entre Ionic con React y el backend. |  | 

| Requerimientos EP1| Endpoints |
|---|---|
| RF-1 : Selección de bloque horario |   |
| RF-2 : Registro de reserva de cita |   |
| RF-3 : Envío de comprobante de la cita |   |
| RF-4 : Carga de documentación |   |
| RF-5 : Visualización de documentos adjuntos por el funcionario |   |
| RF-6 : Validación de veracidad documental |   |
| RF-7 : Visualización de la línea de tiempo del trámite |   |
| RF-8 : Redirección por roles de usuario |   |
| RF-9 : Notificación de licencia lista |   |
| RF-10 : Despliegue de agenda diaria |   |
| RF-11 : Envío recordatorio de cita |   |
| RF-12 : Cancelación de cita |   |
| RF-13 : Búsqueda de tramites personal |   |
| RF-14 : Historial de trámites |   |
| RF-15 : Emision de comprobante |   |
| RF-16 : Configuración de bloques horarios |   |
| RF-17 : Gestión de cuentas de funcionarios |   |

# 3. Tecnologias
| Capa | Tecnologia identificada |
|---|---|
| Servidor | Nose.js + Express 5 |
| Base de datos | PostgreSQL |
| Autenticacion | jsonwebtoken |
| Seguridad |  |
| Pruebas | Insomnia |
| Frontend | Ionic + React |
| Frontend/Backend | Axios |


# 4. Arquitectura y carpetas reales
```
backend
├── base de datos 
│   └── licencias.sql     
├── package-lock.json
├── package.json
├── pruebas               
└── src
    ├── app.js            
    ├── config           
    ├── controllers       
    ├── middlewares       
    ├── routes            
    ├── services          
    └── utils             
```

```
Ionic + React
```

# 5. Preparacion y ejecucion local del ejemplo
## 5.1 Requisitos previos
-Node.js y npm
-PostgreSQL (pgAdmin)
-Insomnia
## 5.2 Base de datos
## 5.3 Iniciar Backend
## 5.4 Problemas frecuentes

# 6. Documentacion de la API existente


# 7. Seguridad y JWT: estado y correcciones necesarias
| Control EP2 | Estado en este proyecto | Evidencia | Mejora pendiente |
|---|---|---|---|
| JWT con expiración | Sí. El token se firma con HS256 y dura 2 horas por defecto, configurable con `JWT_EXPIRES_IN`. | `utils/jwt.js` | Definir con el grupo si 2 h es adecuado |
| Claims mínimos en el JWT | Sí. El token solo lleva `rut` y `rol`, sin contraseña ni datos personales. | `authController.js` | Ninguna |
| Rutas protegidas en backend | Sí. Usuarios, trámites, citas, documentos y bloques horarios exigen token válido y responden 401 si falta o expiró. | `middlewares/authMiddleware.js`, archivos `*Routes.js` | Los catálogos son públicos a propósito (solo lectura) |
| Roles diferenciados | Sí. Hay tres roles (ciudadano, funcionario, administrador) con los middlewares `autorizarRoles` y `autorizarPropioORoles`, que responden 403. El rol lo asigna siempre el servidor al registrar. | `authMiddleware.js`, `authService.js` | Faltan controles de dueño en el detalle de trámites y citas, y en los documentos |
| bcrypt | Sí. El registro guarda el hash con `bcrypt.hash` (10 rondas) y el login usa `bcrypt.compare`. | `utils/claves.js`, `authController.js` | Ninguna |
| Secretos en variables de entorno | Sí. `JWT_SECRET` y las credenciales de PostgreSQL se leen desde `.env`. En el repositorio solo está `.env.ejemplo`. | `utils/jwt.js`, `config/db.js`, `.env.ejemplo` | Exigir un largo mínimo a `JWT_SECRET` |
| Validación de entradas | Sí. Se validan RUT, nombre, correo, teléfono, id, fechas y largos máximos, y se rechazan campos desconocidos. La contraseña exige 8 caracteres o más, mayúscula, minúscula, número y símbolo. | `utils/apoyoControladores.js`, `utils/validacionClave.js` | Opcional: usar una librería de validación |
| Prevención de SQL injection | Sí. Todas las consultas usan parámetros (`$1`, `$2`). | `services/*.js` | Ninguna |
| Minimización de datos | Sí. Ninguna respuesta incluye `clave_hash` y el JWT no lleva datos sensibles. | `authService.js`, `usuarioService.js` | Ninguna |
| Protección de rutas frontend | Pendiente de confirmar con el equipo de frontend. | — | Guardias de ruta en Ionic React y manejo de token expirado |
| Manejo de errores | Sí. Un manejador central responde 500 genérico y registra el detalle solo en consola. El login da el mismo mensaje para un RUT inexistente y una contraseña mala, y una petición sin cuerpo responde 400. | `app.js`, `authController.js` | Opcional: límite de intentos de login |
| Pruebas de seguridad | Pruebas en Insomnia de casos de éxito y de error: login, registro con contraseña débil, registro repetido y rutas con y sin token. | `pruebas/insomnia-auth.json` | Exportar la colección y subirla al repositorio |

# 8. Integración frontend-backend


# 9. Pruebas funcionales y evidencia EP2


# 10. Modelo relacional


# 11. Matriz de cumplimiento EP2


# 12. Listas de verificacion antes de entrega







