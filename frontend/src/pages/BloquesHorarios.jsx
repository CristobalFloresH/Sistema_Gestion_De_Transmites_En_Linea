import { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonInput, IonSpinner, useIonAlert, useIonToast, useIonViewWillEnter,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { getUsuario } from '../services/authService';
import {
  listarTodosLosBloques, crearBloque, actualizarBloque, eliminarBloque,
} from '../services/bloqueHorarioService';
import { formatear, hoyIso } from '../utils/fechas';
// Esta pantalla no esta en el Figma: usa los estilos de la Agenda del funcionario
import './AgendaFuncionario.css';
import './BloquesHorarios.css';

// Bloque vacio del formulario de arriba (el horario de atencion va de 08:00 a 17:00)
const BLOQUE_NUEVO = { hora_inicio: '09:00', hora_fin: '09:30', cupos: 5 };

export default function BloquesHorarios() {
  const [mostrarAviso] = useIonToast();
  const [pedirDato] = useIonAlert();
  const [fecha, setFecha] = useState(hoyIso());
  const [bloques, setBloques] = useState([]);
  const [nuevo, setNuevo] = useState(BLOQUE_NUEVO);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const esAdministrador = getUsuario()?.rol === 'administrador';

  // Trae todos los bloques del dia elegido, activos y desactivados
  const cargar = (dia = fecha) => {
    setCargando(true);
    setError('');
    return listarTodosLosBloques(dia)
      .then(setBloques)
      .catch((e) => { setBloques([]); setError(e.mensaje); })
      .finally(() => setCargando(false));
  };

  useIonViewWillEnter(() => cargar());

  const cambiarFecha = (nuevaFecha) => {
    const dia = nuevaFecha || hoyIso();
    setFecha(dia);
    cargar(dia);
  };

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

  const agregar = () => guardar(async () => {
    await crearBloque({ fecha, ...nuevo, cupos: Number(nuevo.cupos) });
    mostrarAviso({ message: 'Bloque creado', duration: 2000, color: 'success' });
  });

  // Los cupos se cambian en una ventana de Ionic; el backend no deja dejar menos cupos que citas reservadas
  const cambiarCupos = (bloque) => pedirDato({
    header: `Cupos del bloque de las ${bloque.hora_inicio.slice(0, 5)}`,
    inputs: [{ name: 'cupos', type: 'number', min: 1, value: bloque.cupos }],
    buttons: [
      { text: 'Volver', role: 'cancel' },
      {
        text: 'Guardar',
        handler: ({ cupos }) => guardar(() => actualizarBloque(bloque.id_bloque_horario, { cupos: Number(cupos) })),
      },
    ],
  });

  const cambiarActivo = (bloque) =>
    guardar(() => actualizarBloque(bloque.id_bloque_horario, { activo: !bloque.activo }));

  // Borrar solo lo puede hacer el administrador, y el backend se niega si el bloque tuvo citas
  const borrar = (bloque) => pedirDato({
    header: 'Eliminar bloque',
    message: `Vas a eliminar el bloque de las ${bloque.hora_inicio.slice(0, 5)}. Si tuvo citas, desactivalo en vez de borrarlo.`,
    buttons: [
      { text: 'Volver', role: 'cancel' },
      { text: 'Eliminar', role: 'destructive', handler: () => guardar(() => eliminarBloque(bloque.id_bloque_horario)) },
    ],
  });

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="agenda-content">
            <h1 className="agenda-title">Bloques horarios</h1>
            <p className="bloques-ayuda">
              Se puede agendar de lunes a viernes, entre las 08:00 y las 17:00
            </p>

            <div className="agenda-filters">
              <IonInput
                className="filter-select"
                type="date"
                aria-label="Dia de los bloques"
                value={fecha}
                onIonChange={(e) => cambiarFecha(e.detail.value)}
              />
              <span className="bloques-dia">{formatear(fecha, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>

            <div className="agenda-filters">
              <IonInput
                className="filter-select"
                type="time"
                aria-label="Hora de inicio"
                value={nuevo.hora_inicio}
                onIonChange={(e) => setNuevo({ ...nuevo, hora_inicio: e.detail.value })}
              />
              <IonInput
                className="filter-select"
                type="time"
                aria-label="Hora de termino"
                value={nuevo.hora_fin}
                onIonChange={(e) => setNuevo({ ...nuevo, hora_fin: e.detail.value })}
              />
              <IonInput
                className="filter-select"
                type="number"
                min="1"
                aria-label="Cupos"
                value={nuevo.cupos}
                onIonChange={(e) => setNuevo({ ...nuevo, cupos: e.detail.value })}
              />
              <IonButton className="btn btn--green" disabled={guardando} onClick={agregar}>
                Agregar bloque
              </IonButton>
            </div>

            {cargando && <IonSpinner name="crescent" />}
            {!cargando && error && <p>{error}</p>}
            {!cargando && !error && bloques.length === 0 && <p>Este dia no tiene bloques todavia</p>}

            <table className="agenda-table">
              <thead>
                <tr><th>Hora</th><th>Cupos</th><th>Disponibles</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {bloques.map((bloque) => (
                  <tr key={bloque.id_bloque_horario}>
                    <td className="td-hora">
                      {bloque.hora_inicio.slice(0, 5)} a {bloque.hora_fin.slice(0, 5)}
                    </td>
                    <td>{bloque.cupos}</td>
                    <td>{bloque.cupos_disponibles}</td>
                    <td>
                      <span className={`pill ${bloque.activo ? 'aprobado' : 'rechazado'}`}>
                        {bloque.activo ? 'Activo' : 'Desactivado'}
                      </span>
                    </td>
                    <td className="bloques-acciones">
                      <button type="button" className="link-action" disabled={guardando} onClick={() => cambiarCupos(bloque)}>
                        Cambiar cupos
                      </button>
                      <button type="button" className="link-action" disabled={guardando} onClick={() => cambiarActivo(bloque)}>
                        {bloque.activo ? 'Desactivar' : 'Activar'}
                      </button>
                      {esAdministrador && (
                        <button type="button" className="link-action" disabled={guardando} onClick={() => borrar(bloque)}>
                          Eliminar
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
