# Registro de usuarios

## Por qué el registro lo hace el administrador
En el contexto real del sistema, el ciudadano se identifica con Clave Única y las cuentas del personal las administra la municipalidad, por lo que un registro abierto, donde cualquier persona crea su propia cuenta, no corresponde al problema. Por recomendación del ayudante, el registro existe pero solo lo puede usar un administrador.

El administrador crea las cuentas de ciudadanos y funcionarios desde la aplicación. Así también se cubre la creación de cuentas de funcionarios que pide el RF-17.

## Cómo funciona
| Parte | Archivo | Qué hace |
|---|---|---|
| Pantalla de registro | [`Registro.jsx`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/frontend-EP2/frontend/src/pages/Registro.jsx) | Formulario en `/registro`, al que solo entra el administrador desde el enlace "Registro de ciudadanos" de la barra. Permite elegir si la cuenta es de ciudadano o funcionario, y no cambia la sesión del administrador |
| Endpoint `POST /api/auth/registro` | [`authRoutes.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/routes/authRoutes.js), [`authController.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/controllers/authController.js) | Exige el token de un administrador (401 sin token, 403 con otro rol). Crea la cuenta con el rol elegido, ciudadano o funcionario, y no permite crear administradores |
| `validarClave` | [`utils/validacionClave.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/utils/validacionClave.js) | Exige 8 caracteres o más, mayúscula, minúscula, número y símbolo |
| `hashearClave` | [`utils/claves.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/src/utils/claves.js) | Guarda la contraseña como hash bcrypt (10 rondas) |
| Script `npm run hash` | [`scripts/generar-hash.js`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/scripts/generar-hash.js) | Usa las dos funciones anteriores sin necesidad del servidor |
| Pruebas | [`insomnia-auth.json`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/pruebas/insomnia-auth.json) (peticiones 01 a 06) y [`insomnia-registro-admin.json`](https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea/blob/backend-EP2/backend/pruebas/insomnia-registro-admin.json) | Registro de ciudadanos y funcionarios, RUT y correo repetidos, contraseña débil, rol no permitido, registro sin token o sin rol de administrador, y el login de las cuentas nuevas |

## Cómo probarlo
**En la aplicación:** entrar por `/login-funcionario` con el administrador de prueba (`11111111-1`, `Clave123!`), abrir "Registro de ciudadanos" y crear una cuenta. Después cerrar sesión y entrar con la cuenta nueva, por `/login` si es de ciudadano o por `/login-funcionario` si es de funcionario.

**Con Insomnia:** ejecutar las colecciones en el orden de la sección 9 del [README](../README.md) (casos P01 a P03 y P17 a P21).

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
