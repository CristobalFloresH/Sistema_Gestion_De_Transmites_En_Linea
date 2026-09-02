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

Además, el 1.er Estudio de Madurez Digital de Municipalidades —realizado por Movistar Empresas, Fundación País Digital y Fortinet— revela áreas críticas que frenan este proceso. Entre ellas destacan la falta de planificación estratégica (apenas un 6 % cuenta con un plan definido), el déficit en la capacitación del personal en competencias digitales (solo un 16 %), las limitaciones en interoperabilidad y gestión documental (menos del 20 %), y la urgencia de fortalecer los protocolos de ciberseguridad.

En este escenario, uno de los cuellos de botella más evidentes a nivel municipal es la gestión del proceso de licencias de conducir. Actualmente, la baja disponibilidad de agendamiento online para este trámite genera aglomeraciones, largas filas y una alta congestión en la atención presencial. En el caso específico de la Municipalidad de Santo Domingo, la falta de un sistema digital integrado dificulta la toma de horas, el seguimiento del estado de los trámites y la recepción segura de documentos, afectando la experiencia de los vecinos y sobrecargando al personal interno.

Por lo tanto, el problema abordado por el proyecto corresponde a la brecha digital y operativa en la gestión de licencias de conducir de la Municipalidad de Santo Domingo, la cual dificulta la eficiencia del servicio y la vinculación ágil con la ciudadanía, alejando al municipio de los estándares requeridos por la Ley 21.180.

Para dar respuesta a esta problemática, se propone el desarrollo e implementación de una plataforma web centralizada orientada específicamente a la gestión integral de licencias de conducir. Este sistema permitirá optimizar la toma de horas en línea, realizar un seguimiento transparente de los estados del trámite, facilitar la subida y validación de documentos digitales, y dotar a los funcionarios de herramientas administrativas eficientes para el control de todo el flujo.

La propuesta no busca reemplazar por completo la atención institucional, sino constituir un mecanismo tecnológico de apoyo que agilice los procesos internos y reduzca la carga presencial. A través de una interfaz intuitiva y accesible desde diferentes dispositivos, se busca guiar al municipio hacia un nivel óptimo de digitalización y mejora continua.

En definitiva, el desarrollo de esta plataforma web para la Municipalidad de Santo Domingo permitirá centralizar la gestión de uno de los trámites más críticos, acelerar el cumplimiento de la Ley de Transformación Digital y proporcionar una experiencia de interacción más transparente, segura, rápida y cercana entre el municipio y sus ciudadanos.

---

Usuarios objetivo 

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






