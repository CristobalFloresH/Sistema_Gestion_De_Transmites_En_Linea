import { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonInput, IonSpinner, useIonAlert, useIonToast, useIonViewWillEnter,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { registrar, getUsuario } from '../services/authService';
import { listarUsuarios, actualizarUsuario } from '../services/usuarioService';
// Esta pantalla no esta en el Figma: usa los estilos de la Agenda del funcionario y de Bloques horarios
import './AgendaFuncionario.css';
import './BloquesHorarios.css';

// Rol funcionario en el catalogo rol (licencias.sql)
const ID_ROL_FUNCIONARIO = 2;

const CUENTA_NUEVA = { rut: '', nombre: '', correo: '', telefono: '', password: '' };

export default function Funcionarios() {
  const [mostrarAviso] = useIonToast();
  const [pedirDatos] = useIonAlert();
  const [funcionarios, setFuncionarios] = useState([]);
  const [nueva, setNueva] = useState(CUENTA_NUEVA);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const rutPropio = getUsuario()?.rut;

  const cargar = () => {
    setCargando(true);
    setError('');
    return listarUsuarios({ id_rol: ID_ROL_FUNCIONARIO })
      .then(setFuncionarios)
      .catch((e) => { setFuncionarios([]); setError(e.mensaje); })
      .finally(() => setCargando(false));
  };

  useIonViewWillEnter(cargar);

  // Hace la accion pedida sobre la API y recarga la lista; si el backend se queja, muestra su mensaje
  const guardar = async (accion) => {
    setGuardando(true);
    try {
      await accion();
      await cargar();
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 5000, color: 'danger' });
    } finally {
      setGuardando(false);
    }
  };

  // La cuenta la crea el administrador, igual que haria la municipalidad con Clave Unica
  const crear = () => guardar(async () => {
    await registrar({ ...nueva, rol: 'funcionario' });
    setNueva(CUENTA_NUEVA);
    mostrarAviso({ message: 'Funcionario creado', duration: 2500, color: 'success' });
  });

  const editar = (funcionario) => pedirDatos({
    header: `Editar a ${funcionario.nombre}`,
    inputs: [
      { name: 'nombre', value: funcionario.nombre, placeholder: 'Nombre' },
      { name: 'correo', type: 'email', value: funcionario.correo, placeholder: 'Correo' },
      { name: 'telefono', value: funcionario.telefono ?? '', placeholder: 'Telefono (opcional)' },
    ],
    buttons: [
      { text: 'Volver', role: 'cancel' },
      {
        text: 'Guardar',
        handler: ({ nombre, correo, telefono }) => guardar(() => actualizarUsuario(funcionario.rut, {
          nombre,
          correo,
          telefono: telefono || null,
        })),
      },
    ],
  });

  // Desactivar deja la cuenta sin acceso pero conserva sus revisiones; el backend rechaza el login despues
  const cambiarActivo = (funcionario) =>
    guardar(() => actualizarUsuario(funcionario.rut, { activo: !funcionario.activo }));

  const campo = (nombre, etiqueta, tipo = 'text') => (
    <IonInput
      className="filter-select"
      type={tipo}
      aria-label={etiqueta}
      placeholder={etiqueta}
      autocomplete="new-password" //evita que el navegador rellene la clave guardada del administrador
      value={nueva[nombre]}
      onIonInput={(e) => setNueva({ ...nueva, [nombre]: e.detail.value ?? '' })}
    />
  );

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="agenda-content">
            <h1 className="agenda-title">Funcionarios</h1>

            <div className="agenda-filters">
              {campo('rut', 'RUT 12345678-9')}
              {campo('nombre', 'Nombre')}
              {campo('correo', 'Correo', 'email')}
              {campo('telefono', 'Telefono')}
              {campo('password', 'Clave', 'password')}
              <IonButton className="btn btn--green" disabled={guardando} onClick={crear}>
                Crear funcionario
              </IonButton>
            </div>

            {cargando && <IonSpinner name="crescent" />}
            {!cargando && error && <p>{error}</p>}
            {!cargando && !error && funcionarios.length === 0 && <p>Todavia no hay funcionarios registrados</p>}

            <table className="agenda-table">
              <thead>
                <tr><th>RUT</th><th>Nombre</th><th>Correo</th><th>Telefono</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {funcionarios.map((funcionario) => (
                  <tr key={funcionario.rut}>
                    <td>{funcionario.rut}</td>
                    <td>{funcionario.nombre}</td>
                    <td>{funcionario.correo}</td>
                    <td>{funcionario.telefono ?? '—'}</td>
                    <td>
                      <span className={`pill ${funcionario.activo ? 'aprobado' : 'rechazado'}`}>
                        {funcionario.activo ? 'Activo' : 'Desactivado'}
                      </span>
                    </td>
                    <td className="bloques-acciones">
                      <button type="button" className="link-action" disabled={guardando} onClick={() => editar(funcionario)}>
                        Editar
                      </button>
                      {/* Un administrador no puede desactivarse a si mismo: el backend tambien lo rechaza */}
                      {funcionario.rut !== rutPropio && (
                        <button type="button" className="link-action" disabled={guardando} onClick={() => cambiarActivo(funcionario)}>
                          {funcionario.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
