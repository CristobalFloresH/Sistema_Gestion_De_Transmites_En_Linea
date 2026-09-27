## Nombre de proyecto
Sistema de gestion de tramites en linea

## Integrantes del equipo 

| Nombre | Rol en el proyecto |
|---|---|
| Diego Cortez | Frontend (UI/UX y Figma) / Wireframes PC |
| Rafael Valdes | Frontend (UI/UX y Figma) / Wireframes móvil |
| Mauricio Morales | Documentación |
| Cristobal Flores | Frontend / Ionic + React |

## Distribucion de responsabilidades 

- Frontend (Ionic + React): estructura de vistas, componentes reutilizables (NavBar, ProgressBar), navegación y rutas protegidas con React Router.
- UI/UX y Figma: mockups web y móvil, flujo de navegación del ciudadano y del funcionario, jerarquía visual.
- Documentación y gestión: README, manejo de ramas, control de versiones y evidencia de avance.


## Descripcion general del sistema
El sistema propuesto busca digitalizar y optimizar la gestión de distintos trámites municipales. Para ello, se desarrolló una plataforma cuyo objetivo es centralizar los procesos de obtención de licencias de conducir, abarcando distintas modalidades como la primera emisión, la renovación y la reimpresión.

## Problema o necesidad que aborda

Según el [Estudio de Madurez Digital de Municipalidades](https://ww2.movistar.cl/empresas/comunidad/Informe-Municipios-TL-REV.pdf), solo el 19 % de las municipalidades de Chile permite reservar en línea la hora para la licencia de conducir, lo que genera filas, aglomeraciones y sobrecarga en la atención presencial. A esto se suma que la Ley 21.180 exige que los procedimientos administrativos sean electrónicos a más tardar en 2027.

En la Municipalidad de Santo Domingo, la falta de un sistema integrado dificulta la toma de horas, el seguimiento de los trámites y la recepción de documentos.

## Objetivos del proyecto
Desarrollar e implementar un sistema de agendamiento y gestión de trámites de licencias de conducir que permita a los ciudadanos de Santo Domingo realizar sus solicitudes de forma remota, reduciendo así los tiempos de espera y la carga de atención presencial en la municipalidad.

Con el fin de cumplir el objetivo general, el proyecto se desglosa en los siguientes objetivos específicos:

- Desarrollar una aplicación web y móvil que permita a los ciudadanos iniciar solicitudes de primera emisión, renovación y reimpresión de licencias de conducir.
- Implementar un sistema de agendamiento que permita al ciudadano seleccionar un bloque horario disponible para su atención presencial.
- Permitir la carga digital de los documentos requeridos, como cédula de identidad y certificado de residencia, para su revisión previa a la visita.
- Ofrecer a los ciudadanos el seguimiento del estado de sus trámites y un historial de solicitudes anteriores.
- Proveer a los funcionarios municipales una agenda para revisar solicitudes, filtrarlas por estado y tipo de trámite, y validar la documentación adjunta.

## Principales funcionalidades
| ID | Rol | Funcionalidad |
| --- | --- | --- |
| RF-01 | Ciudadano | Agendar cita con distintos bloques de horario|
| RF-04 | Ciudadano | Poder subir los documentos exigidos en formato PDF |
| RF-07 | Ciudadano / Funcionario | Se podra ver en que etapa va cada tramite |
| RF-06 | Funcionario | Validar los documentos de los ciudadanos|
| RF-10 | Funcionario | Podran ver una agenda con todas las citas (aprobadas|denegadas) |
| RF-13 | Funcionario | Busqueda por RUT |
| RF-16 | Administrador | Administrar bloques de horarios |

## Media

### Requisitos
- [Node.js](https://nodejs.org/) 20.19 o superior (probado con Node 24)
- npm (se instala junto con Node.js)
- [Git](https://git-scm.com/)

### Instalación
El código del frontend está en la rama frontend, dentro de la carpeta frontend/.


- git clone https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea.git
- cd Sistema_Gestion_De_Transmites_En_Linea
- git checkout frontend
- cd frontend
- npm install

### Ejecución

npm run dev

Luego abrir http://localhost:5173 en el navegador.

### Uso
Por ahora el inicio de sesión es simulado (no hay backend todavía):
- **Ciudadano:** en *Ingresar*, escribir cualquier RUT y clave y presionar "Ingresar".
- **Funcionario:** en *Ingresar*, presionar "Ingreso funcionarios".

Las rutas protegidas redirigen al login si no hay sesión, y las rutas de funcionario redirigen al inicio si se entra como ciudadano.

## Tecnologías utilizadas (frontend)
- [Ionic](https://ionicframework.com/) 9 con React
- [React](https://react.dev/) 19
- [React Router](https://reactrouter.com/) 6 (Ionic 9 requiere la versión 6)
- [Vite](https://vite.dev/) 8
- JavaScript

## Hypervínculos

[Figma](https://www.figma.com/design/GfTP09qFYtAsPHPTJxQtor/mockups?node-id=0-1&t=2XZMfuvjLfRCh2wf-1)
