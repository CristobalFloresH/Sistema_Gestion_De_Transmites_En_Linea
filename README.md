## Nombre de proyecto
Sistema de gestion de tramites en linea

## Integrantes
Diego Cortez

Rafael Valdes

Mauricio Morales

Cristobal Flores

## Distribucion
Diego Cortez : Frontend / wireframes-pc

Rafael Valdes : Frontend / wireframes-movil

Mauricio Morales : Documentacion

Cristobal Flores : Frontend / Ionic + React

## Descripcion general del sistema
El sistema propuesto busca digitalizar y optimizar la gestión de distintos trámites municipales. Para ello, se desarrolló una plataforma cuyo objetivo es centralizar los procesos de obtención de licencias de conducir, abarcando distintas modalidades como la primera emisión, la renovación y la reimpresión.

## Objetivos del proyecto
Desarrollar e implementar un sistema de agendamiento y gestión de trámites de licencias de conducir que permita a los ciudadanos de Santo Domingo realizar sus solicitudes de forma remota, reduciendo así los tiempos de espera y la carga de atención presencial en la municipalidad.

Con el fin de cumplir el objetivo general, el proyecto se desglosa en los siguientes objetivos específicos:

- Desarrollar una aplicación web y móvil que permita a los ciudadanos iniciar solicitudes de primera emisión, renovación y reimpresión de licencias de conducir.
- Implementar un sistema de agendamiento que permita al ciudadano seleccionar un bloque horario disponible para su atención presencial.
- Permitir la carga digital de los documentos requeridos, como cédula de identidad y certificado de residencia, para su revisión previa a la visita.
- Ofrecer a los ciudadanos el seguimiento del estado de sus trámites y un historial de solicitudes anteriores.
- Proveer a los funcionarios municipales una agenda para revisar solicitudes, filtrarlas por estado y tipo de trámite, y validar la documentación adjunta.

## Principales funcionalidades
Gestión de los 3 tipos de tramites, sistema de agendamiento, trazabilidad del tramite.

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
