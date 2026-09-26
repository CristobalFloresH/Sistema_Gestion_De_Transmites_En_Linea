# Proyecto_Final_INF3245
# Proyecto_Final_INF3245

## Índice
1. [Justificación del problema](#justificación-del-problema)
2. [Usuarios](#usuarios)
   - [Roles](#roles)
   - [Proto-personas](#proto-personas)
3. [Requerimientos](#requerimientos)
4. [Arquitectura de la información/Ux](#arquitectura-de-la-informacionux)
   - [Diferenciación x roles](#diferenciación-x-roles)
   - [Flujos principales Tareas](#flujos-principales-tareas)
   - [Puntos críticos de interacción](#puntos-críticos-de-interacción)
   - [Justificación Técnica](#justificación-técnica)
5. [Bocetos UX/UI](#bocetos-uxui)
6. [Frontend con Ionic-React](#frontend-con-ionic-react)

---

## Justificación del problema

La madurez digital de los municipios en Chile avanza de manera progresiva, impulsada por la necesidad de ofrecer servicios públicos más eficientes y conectados con la ciudadanía. Sin embargo, a pesar de que el 90 % de las municipalidades ya permite realizar trámites clave como el pago del permiso de circulación online, todavía enfrentan importantes desafíos estructurales para consolidar una gestión 100 % digital.

Una de las principales dificultades radica en que la implementación tecnológica ha sido desigual y fragmentada, lo que limita la capacidad de respuesta institucional frente a las exigencias de la Ley de Transformación Digital del Estado (Ley 21.180). Dicha normativa exige que todos los organismos públicos implementen sistemas totalmente digitales antes de 2027, eliminando el papel y garantizando la interoperabilidad de expedientes.

Además, el primer Estudio de Madurez Digital de Municipalidades (realizado por Movistar Empresas, Fundación País Digital y Fortinet) revela áreas críticas que frenan este proceso. Entre ellas destacan la falta de planificación estratégica (apenas un 6 % cuenta con un plan definido), el déficit en la capacitación del personal en competencias digitales (solo un 16 %), las limitaciones en interoperabilidad y gestión documental (menos del 20 %), y la urgencia de fortalecer los protocolos de ciberseguridad.

En este escenario, uno de los cuellos de botella más evidentes a nivel municipal es la gestión del proceso de licencias de conducir. Actualmente, la baja disponibilidad de agendamiento online para este trámite genera aglomeraciones, largas filas y una alta congestión en la atención presencial. En el caso específico de la Municipalidad de Santo Domingo, la falta de un sistema digital integrado dificulta la toma de horas, el seguimiento del estado de los trámites y la recepción segura de documentos, afectando la experiencia de los vecinos y sobrecargando al personal interno.

Por lo tanto, el problema abordado por el proyecto corresponde a la brecha digital y operativa en la gestión de licencias de conducir de la Municipalidad de Santo Domingo, la cual dificulta la eficiencia del servicio y la vinculación ágil con la ciudadanía, alejando al municipio de los estándares requeridos por la Ley 21.180.

Para dar respuesta a esta problemática, se propone el desarrollo e implementación de una plataforma web centralizada orientada específicamente a la gestión integral de licencias de conducir. Este sistema permitirá optimizar la toma de horas en línea, realizar un seguimiento transparente de los estados del trámite, facilitar la subida y validación de documentos digitales, y dotar a los funcionarios de herramientas administrativas eficientes para el control de todo el flujo.

La propuesta no busca reemplazar por completo la atención institucional, sino constituir un mecanismo tecnológico de apoyo que agilice los procesos internos y reduzca la carga presencial. A través de una interfaz intuitiva y accesible desde diferentes dispositivos, se busca guiar al municipio hacia un nivel óptimo de digitalización y mejora continua.

En definitiva, el desarrollo de esta plataforma web para la Municipalidad de Santo Domingo permitirá centralizar la gestión de uno de los trámites más críticos, acelerar el cumplimiento de la Ley de Transformación Digital y proporcionar una experiencia de interacción más transparente, segura, rápida y cercana entre el municipio y sus ciudadanos.

---

## Usuarios objetivo 

La aplicación considera principalmente dos grupos de usuarios: vecinos (ciudadanos) y funcionarios municipales. Adicionalmente, se contempla un rol de administración para la gestión general y técnica de la plataforma en la Municipalidad de Santo Domingo.

Vecinos (Ciudadanos)

Los vecinos corresponden a los usuarios finales y principales beneficiarios de la plataforma. Se considera que constituyen un grupo diverso respecto a su edad, familiaridad con la tecnología, disponibilidad de tiempo y necesidades de accesibilidad para realizar trámites presenciales o digitales.

Dentro de este grupo pueden existir ciudadanos que:

- Realizan trámites por primera vez o renuevan su licencia de conducir.
- Requieren agendar horas de atención según su disponibilidad laboral o personal.
- Necesitan revisar con claridad los requisitos y documentos obligatorios antes de asistir.
- Presentan diferentes niveles de experiencia con plataformas web o gubernamentales.
- Requieren conocer el estado actual de su trámite sin necesidad de llamar o ir al municipio.
- Suben y digitalizan documentos desde diferentes dispositivos (teléfonos móviles o computadores).
- Necesitan una estructura clara y predecible de navegación para evitar confusiones.
- Requieren reducir la cantidad de información presentada simultáneamente en pantalla.
- Presentan dificultades de movilidad o tiempo para realizar trámites de manera presencial.
- Pueden requerir asistencia o instrucciones muy concretas en cada etapa del proceso.

La población objetivo considera también a adultos mayores y personas con menor alfabetización digital, reconociendo que pueden requerir interfaces más intuitivas, tipografías claras y procesos guiados paso a paso.

La plataforma deberá evitar asumir que todos los usuarios poseen el mismo dominio tecnológico. En su lugar, ofrecerá alternativas claras de navegación, soporte visual y accesibilidad multiplataforma.

Necesidades principales de los vecinos:

- Agendar horas de atención para licencias de conducir de forma rápida y sin filas.
- Consultar en tiempo real el estado en el que se encuentra su trámite.
- Subir documentos obligatorios (fotografías, certificados, antecedentes) de manera online.
- Recibir notificaciones claras sobre las siguientes etapas o correcciones necesarias.
- Acceder a la plataforma desde computadores y dispositivos móviles indistintamente.
- Disponer de instrucciones sencillas, concretas y directas en cada paso.
- Visualizar requisitos previos claros para evitar rechazos en las pruebas médicas o teóricas.
- Reducir la incertidumbre mediante un seguimiento transparente del proceso.
- Contar con una navegación consistente y predecible.
- Disminuir los tiempos de espera y la necesidad de traslados presenciales innecesarios.

---
## Roles del sistema
•Vecino (ciudadano): agenda, reprograma o cancela su hora, sube sus documentos, consulta el estado de su trámite en la línea de tiempo y descarga su comprobante.

•Funcionario municipal: revisa la agenda diaria, visualiza y valida (aprueba o rechaza) los documentos, busca expedientes por RUT, actualiza el estado del trámite y consulta el historial de cada ciudadano.

•Administrador: gestiona la plataforma a nivel general y técnico: crea y desactiva cuentas de funcionarios, configura los bloques horarios disponibles y supervisa el funcionamiento del sistema.

---
## Proto-personas

### Proto-persona 1: Vecino trabajador con poco tiempo

Nombre: Diego
Rol: Vecino

#### Características generales

Diego tiene 32 años, trabaja a tiempo completo y necesita obtener su licencia por primera vez para un nuevo empleo. Usa a diario el celular y el computador, y está acostumbrado a hacer trámites bancarios y de compras en línea.

#### Necesidades principales

• Agendar según su disponibilidad laboral.

• Evitar viajes y esperas innecesarias.

• Subir documentos desde el celular en pocos minutos.

• Recibir recordatorios y avisos de correcciones.

• Ver el avance de su trámite en cualquier momento.

#### Objetivos de uso

Completar la mayor parte del trámite en línea y asistir presencialmente solo cuando sea indispensable.

#### Dificultades o puntos de frustración

• Falta de horas disponibles o cambios de último minuto.

• Rechazo de documentos sin saber el motivo.

• Tener que repetir información que ya entregó.

• Plataformas que no funcionan bien en el celular.

• Visitar demasiadas veces el sitio presencial.

#### Funcionalidades que utilizaría

Selección de bloque horario, registro de reserva, carga de documentación, línea de tiempo, recordatorio de cita y cancelación de cita.

#### Dispositivo y contexto probable de acceso

Teléfono móvil durante pausas laborales o traslados, y computador ocasionalmente. Nivel de experiencia tecnológica estimado: medio-alto.

---
### Proto-persona 2: Vecino adulto mayor que renueva su licencia

Nombre: Maria Elsa 
Rol: Vecino

#### Características generales

Rosa tiene 68 años y renueva su licencia de conducir cada cierto tiempo. Usa el teléfono móvil para WhatsApp y llamadas, pero tiene poca experiencia con trámites en línea. Suele pedir ayuda a sus hijos cuando debe usar plataformas del Estado.

#### Necesidades principales

•Instrucciones concretas y breves en cada paso.
•Letra clara, botones grandes y buen contraste.
•Saber de antemano qué documentos y exámenes necesita.
•Conocer el estado de su trámite sin tener que ir al municipio ni llamar.
•Poder cancelar o cambiar su hora si tiene un imprevisto de salud.

#### Objetivos de uso

Agendar su hora sin hacer fila, saber qué debe llevar o facilidad para subir documentos y enterarse cuando su licencia esté lista para retiro.

#### Dificultades o puntos de frustración

•Pantallas con demasiada información a la vez.
•Términos técnicos o poco claros.
•Formularios largos o sin mensajes de error comprensibles.
•No saber si la acción que hizo quedó registrada.
•Dificultad para escanear o subir documentos.

#### Funcionalidades que utilizaría

Selección de bloque horario, comprobante por correo o WhatsApp, recordatorio de cita, carga de documentos, línea de tiempo del trámite, cancelación de cita y notificación de licencia lista.

#### Dispositivo y contexto probable de acceso

Teléfono móvil, desde su casa y en ocasiones con apoyo de un familiar. 
Nivel de experiencia tecnológica estimado: bajo.

---
### Proto-persona 3: Funcionaria de atención de licencias

Nombre: Patricia
Rol: Funcionario municipal

#### Características generales

Patricia tiene 45 años y trabaja en la unidad de licencias de conducir. Atiende público durante todo el día y maneja expedientes en papel y planillas. Tiene experiencia básica en herramientas digitales, pero poca en sistemas nuevos.

#### Necesidades principales

•Ver rápidamente quiénes están agendados cada día.

•Revisar documentos en pantalla sin manipular papeles.

•Aprobar o rechazar documentos dejando el motivo registrado.

•Encontrar un expediente con solo el RUT.

•Actualizar el estado del trámite de forma simple.

#### Objetivos de uso

Reducir la carga presencial, ordenar el flujo de atención y tener respaldo claro de cada trámite.

#### Dificultades o puntos de frustración

•Documentos ilegibles o incompletos.

•Búsquedas lentas de expedientes.

•Interfaces con demasiados pasos para una acción simple.

•Errores en la agenda que generan aglomeraciones.

#### Funcionalidades que utilizaría

Agenda diaria, visualización y validación de documentos, búsqueda por RUT, historial de trámites y actualización de estados.

#### Dispositivo y contexto probable de acceso

Computador de escritorio en su puesto de trabajo, durante toda la jornada. Nivel de experiencia tecnológica estimado: medio.
---
### Proto-Persona 4:

---
# Requerimientos funcionales
**RF-1 : Selección de bloque horario**
El sistema desplegará un calendario interactivo que mostrará los días junto a los bloques de horarios disponibles.

**RF-2 : Registro de reserva de cita**
El sistema registrará y almacenará en la base de datos la reserva de la cita seleccionada por el usuario asociando directamente a su RUT.

**RF-3 : Envío de comprobante por correo**
El sistema enviará un correo de confirmación de forma automática al usuario luego de agendar su cita..

**RF-4 : Carga de documentación** 
La plataforma web permitirá al usuario adjuntar y cargar los documentos requeridos, los cuales deberán ser enviados exclusivamente en formato PDF.

**RF-5 : Visualización de documentos adjuntos por el funcionario**
El sistema permitirá a los funcionarios municipales,  visualizar en línea los documentos adjuntados por los usuario para revisar el contenido del archivo.

**RF-6 : Validación de veracidad documental**
El sistema permitirá a los funcionarios aprobar o rechazar los documentos adjuntados por los usuarios tras verificar su veracidad y cumplimiento normativo.

**RF-7 : Visualización de la línea de tiempo del trámite**
El sistema mostrará en el panel de los usuario y funcionarios una línea de tiempo actualizada que refleja todas las fases del trámite (Cita Reservada, Examen Teórico Aprobado, Examen Psicotécnico Aprobado, Fotografía Capturada, Licencia en Impresión y Lista para Retiro).

**RF-8 : Redirección por roles de usuario**
El sistema identificará el rol del usuario al momento de autenticarse redirigiendo de manera automática a su interfaz según correspondan sus permisos de acceso.

**RF-9 : Notificación de licencia lista**
El sistema enviará una notificación automática vía correo electrónico al usuario cuando el estado de su licencia cambie a “Lista para Retiro”.

**RF-10 : Despliegue de agenda diaria**
El sistema desplegará a los funcionarios una lista detallada de todos los usuarios agendados para cada día y horario específico.

**RF-11 : Envío recordatorio de cita**
El sistema enviará un correo de recordatorio al usuario 24 horas antes de la hora agendada.

**RF-12 : Cancelación de cita**
El sistema permitirá al usuario cancelar su cita agendada a través de un panel web, liberando automáticamente el bloque de horario en el calendario para otro usuario.

**RF-13 : Búsqueda de tramites personal**
El sistema permitirá a funcionarios buscar expedientes y solicitudes de licencias de conducir ingresando el RUT del ciudadano.

**RF-14 : Historial de trámites**
El sistema permitirá a los funcionarios consultar un registro de todos los trámites y procesos por los que ha pasado un ciudadano.

**RF-15 : Emision de comprobante**
El sistema permitirá al usuario descargar un comprobante digital en formato PDF al finalizar el proceso escogido, este incluirá el resumen del tramite junto a la información soliticada.


# Requerimientos no funcionales
**RNF-1 : Validación de identidad institucional**
El sistema validara la identidad de la persona mediante el ingreso de su RUT, número de documento y validación de su ClaveUnica

**RNF-2 : Verificación de integridad de archivos**
El sistema verificará la validez de los documentos mediante comprobación de códigos de verificación y formatos permitidos en todos los archivos.

**RNF-3 : Restricción horaria del módulo de agendamiento**
El módulo de agendamiento restringe el horario de reservas exclusivamente al rango de 11:00 a 12:00 horas, de lunes a viernes.

**RNF-4 : Escalabilidad  **
La plataforma web soportara un volumen de hasta 50.000 usuarios interactuando simultáneamente


## EP 1.4 Arquitectura de navegación
Rutas principales y secundarias.

| Ruta | Vista | Acceso | Descripción |
| --- | --- | --- | --- |
| `/` | Menú principal | Pública | Inicio, accesos rápidos a trámites |
| `/login` | Login | Pública | Inicio de sesión con RUT y Clave Única |
| `/tramite-licencia` | Trámite licencia | Privada (Ciudadano o Funcionario) | Tipo de trámite, día y bloque horario, documentos |
| `/calendario` | Calendario | Privada (Ciudadano o Funcionario) | Más fechas y bloques horarios disponibles |
| `/tramite-finalizado` | Trámite finalizado | Privada (Ciudadano o Funcionario) | Confirmación de la cita y comprobante |
| `/mis-tramites` | Mis trámites | Privada (Ciudadano o Funcionario) | Estado y línea de tiempo de los trámites |
| `/funcionario/agenda` | Agenda | Privada (Funcionario) | Citas del día con búsqueda y filtros |
| `/funcionario/agenda/proceso` | Proceso del trámite | Privada (Funcionario) | Documentos adjuntos y validación |
| `/funcionario/agenda/error` | Proceso del trámite (rechazado) | Privada (Funcionario) | Misma vista, con validaciones fallidas |

### Jerarquía de vistas

```
/, /login                           (públicas)
/tramite-licencia                   (RF-1, RF-4)
 ├── /calendario                    (vista hija, más horarios, RF-1)
 └── /tramite-finalizado            (confirmación, RF-2, RF-15)
/mis-tramites                       (RF-7, RF-12)
/funcionario/agenda                 (solo funcionario, RF-10, RF-13)
 ├── /funcionario/agenda/proceso    (RF-5, RF-6, RF-14)
 └── /funcionario/agenda/error      (misma vista con validaciones fallidas)
```

Todas las vistas comparten la barra de navegación superior (`NavBar`), que muestra "Ingresar" sin sesión o el menú "Hola ..." con sesión (con "Mis trámites" y "Cerrar sesión"); el funcionario ve además el enlace "Agenda".

### Flujo de navegación entre funcionalidades

- Desde el **menú principal** se accede a Trámite licencia ("Ver trámites" o las tarjetas de Accesos rápidos) y a Mis trámites ("Seguir mis trámites").
- El agendamiento avanza en orden: Trámite licencia → (opcional) Calendario → Trámite finalizado → "Volver al inicio".
- El funcionario entra a la Agenda desde la barra superior y vuelve a ella desde el detalle del trámite mediante la ruta de navegación "Agenda > Proceso del trámite".

### Diferenciación de acceso por rol

| Segmento de rutas | Rol requerido | Mecanismo |
| --- | --- | --- |
| `/`, `/login` | Público | Sin protección |
| `/tramite-licencia`, `/calendario`, `/tramite-finalizado`, `/mis-tramites` | Ciudadano o Funcionario | `ProtectedRoute` verifica que exista sesión; si no, redirige a `/login` |
| `/funcionario/*` | Solo Funcionario | `ProtectedRoute` con `rol="funcionario"`; sin sesión redirige a `/login` y con otro rol redirige a `/` |

La sesión se obtiene desde `services/authService.js`. En esta entrega es simulada (guarda solo el rol); en la Entrega 2 se reemplaza por autenticación con JWT sin modificar las vistas.


### Flujo de tareas principales (task flows)

**Task flow 1 — Agendar hora para la licencia (Ciudadano):**
`/` → "Ver trámites" (si no hay sesión, `/login`) → `/tramite-licencia` → elegir tipo de trámite → elegir día y bloque horario (RF-1) o "¿Buscas más horarios?" → `/calendario` → "Continuar" → `/tramite-finalizado` con el resumen de la cita (RF-2) → "Descargar comprobante" (RF-15).

**Task flow 2 — Seguir el estado de un trámite (Ciudadano):**
`/` → "Seguir mis trámites" (o menú "Hola ..." → "Mis trámites") → `/mis-tramites` → revisar la tarjeta del trámite con su estado y línea de tiempo (RF-7) → acciones disponibles como "Cancelar cita" (RF-12).

**Task flow 3 — Validar un trámite (Funcionario):**
`/login` → "Ingreso funcionarios" → "Agenda" en la barra superior → `/funcionario/agenda` (RF-10) → buscar por RUT o nombre y filtrar por estado o trámite (RF-13) → "Ver proceso del trámite" → revisar documentos adjuntos (RF-5) → "Aprobar" o "Rechazar" (RF-6).

### Puntos críticos de interacción

- **Redirección obligatoria de login:** cualquier ruta privada sin sesión activa redirige a `/login`, y las rutas de funcionario no son accesibles para el ciudadano.
- **Validación del formulario de login:** cada campo (`IonInput`) muestra su propio error (borde rojo y mensaje) y el RUT indica el formato esperado.
- **Selección de fecha y bloque horario:** el calendario (`IonDatetime`) no permite fechas pasadas, se muestra un resumen de lo seleccionado y "Continuar" queda deshabilitado hasta elegir un bloque.
- **Feedback al aprobar o rechazar:** el funcionario recibe un aviso inmediato (`IonToast`) verde o rojo según la acción.
- **Cierre de sesión:** como Ionic mantiene las páginas visitadas en memoria, la sesión se vuelve a verificar al entrar a cada página, evitando ver vistas privadas con la flecha "atrás" después de cerrar sesión.

### Coherencia entre dispositivos

- La aplicación es una sola para web y móvil: las mismas rutas, vistas y flujos en ambos.
- Los componentes de Ionic utilizados (`IonButton`, `IonInput`, `IonSelect`, `IonSearchbar`, `IonDatetime`, `IonCard`, `IonToast`) se adaptan al dispositivo (interacción táctil y estilo de cada plataforma).
- En **móvil**, la navegación principal se trasladará a una barra inferior (`IonTabs`) o un menú lateral (`IonMenu`), según el prototipo de Figma, y las vistas de varias columnas se apilarán verticalmente; en **web** se mantiene la barra superior actual.

### Justificación técnica de las decisiones

- **Ionic React + React Router 6:** `IonReactRouter` e `IonRouterOutlet` entregan navegación tipo aplicación (transiciones, historial y botón "atrás") mientras React Router maneja el enrutamiento declarativo. Se usa la versión 6 porque es la compatible con Ionic 9.
- **Rutas agrupadas por rol:** las vistas del funcionario comparten el prefijo `/funcionario`, lo que hace clara la estructura y permite aplicar la protección de rol de forma uniforme con `ProtectedRoute`.
- **Estructura modular (pages/components/routes/services):** separa vistas, componentes reutilizables (`NavBar`, `ProgressBar`), protección de rutas y lógica de sesión, lo que facilita escalar el proyecto en la próxima entrega: la capa de `services` puede reemplazar la sesión simulada por llamadas reales a la API sin tocar las vistas.

