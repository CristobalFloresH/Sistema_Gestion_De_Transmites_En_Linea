## Instalación y ejecución

### Requisitos
- [Node.js](https://nodejs.org/) 20.19 o superior (probado con Node 24)
- npm (se instala junto con Node.js)
- [Git](https://git-scm.com/)

### Instalación
El código del frontend está en la rama frontend, dentro de la carpeta frontend/.


git clone https://github.com/CristobalFloresH/Sistema_Gestion_De_Transmites_En_Linea.git
cd Sistema_Gestion_De_Transmites_En_Linea
git checkout frontend
cd frontend
npm install

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
