# Registro de usuarios

## Por qué la aplicación no tiene registro
En el contexto real del sistema, el ciudadano se identifica con Clave Única y las cuentas del personal las administra la municipalidad, por lo que un registro abierto no corresponde al problema. La profesora nos confirmó que el registro no aplica a este proyecto. Aun así, como en la EP1 se descontó puntaje por no tenerlo, se dejó el código necesario para un registro.

No está implementado en la aplicación. El código se mantiene **solo para demostrar el cumplimiento de la rúbrica**: el frontend no tiene pantalla ni enlaces de registro.

## Qué se mantiene
| Parte | Archivo | Qué hace |
|---|---|---|
| Endpoint `POST /api/auth/registro` | [`authRoutes.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/authRoutes.js), [`authController.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/controllers/authController.js) | Crea un usuario. El rol siempre queda como ciudadano, aunque el cuerpo traiga otro |
| `validarClave` | [`utils/validacionClave.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/utils/validacionClave.js) | Exige 8 caracteres o más, mayúscula, minúscula, número y símbolo |
| `hashearClave` | [`utils/claves.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/utils/claves.js) | Guarda la contraseña como hash bcrypt (10 rondas) |
| Script `npm run hash` | [`scripts/generar-hash.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/scripts/generar-hash.js) | Usa las dos funciones anteriores sin necesidad del servidor |
| Pruebas | [`insomnia-auth.json`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/pruebas/insomnia-auth.json), peticiones 01 a 06 | Registro válido, RUT repetido, correo repetido, contraseña débil, rol ignorado y login del usuario nuevo |

## Cómo probarlo
**Con Insomnia:** ejecutar las peticiones 01 a 06 de la colección de autenticación (ver la sección 9 del [README](../README.md)).

**Sin el servidor:** desde la carpeta `backend/`:
```
npm run hash -- "Clave123!"
La contraseña es segura. Hash generado:
$2b$10$...

npm run hash -- "clave"
La contraseña no es segura:
- password debe tener al menos 8 caracteres
- password debe incluir una letra mayúscula
- password debe incluir un número
- password debe incluir un símbolo (por ejemplo ! o #)
```
El hash cambia cada vez que se ejecuta, porque bcrypt agrega un valor aleatorio, pero todos sirven igual. Con él se pueden generar los hashes de los usuarios de prueba de `licencias.sql`.
