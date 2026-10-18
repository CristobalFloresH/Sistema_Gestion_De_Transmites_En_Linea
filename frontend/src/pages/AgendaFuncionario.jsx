import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonSearchbar, IonSelect, IonSelectOption, IonSpinner, useIonViewWillEnter } from '@ionic/react';
import NavBar from '../components/NavBar';
import { listarTramites } from '../services/tramiteService';
import { listarCitasVigentes } from '../services/citaService';
import { listarTiposTramite, listarEstadosTramite } from '../services/catalogoService';
import { formatear } from '../utils/fechas';
import './AgendaFuncionario.css';

// Ids del catalogo estado_tramite (licencias.sql)
const ID_CITA_RESERVADA = 1;
const ID_RECHAZADO = 7;

// Color del estado: pendiente si aun no se atiende, rojo si se rechazo, verde si ya avanzo
function claseEstado(idEstado) {
  if (idEstado === ID_RECHAZADO) return 'rechazado';
  if (idEstado === ID_CITA_RESERVADA) return 'pendiente';
  return 'aprobado';
}

export default function AgendaFuncionario() {
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTramite, setFiltroTramite] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const [citas, setCitas] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Ionic deja la pagina montada: se recargan los datos cada vez que se entra
  useIonViewWillEnter(() => {
    setCargando(true);
    setError('');
    Promise.all([listarCitasVigentes(), listarTramites(), listarTiposTramite(), listarEstadosTramite()])
      .then(([datosCitas, datosTramites, datosTipos, datosEstados]) => {
        setCitas(datosCitas);
        setTramites(datosTramites);
        setTipos(datosTipos);
        setEstados(datosEstados);
      })
      .catch((e) => setError(e.mensaje))
      .finally(() => setCargando(false));
  });

  // Cada cita junto con su tramite (de ahi salen el nombre, el tipo y el estado)
  const filas = citas
    .map((cita) => ({ cita, tramite: tramites.find((t) => t.id_tramite === cita.id_tramite) }))
    .filter(({ tramite }) => tramite);

  const citasFiltradas = filas.filter(({ tramite }) => {
    if (filtroEstado && String(tramite.id_estado_tramite) !== filtroEstado) return false;
    if (filtroTramite && String(tramite.id_tipo_tramite) !== filtroTramite) return false;
    if (busqueda && !tramite.nombre_ciudadano.toLowerCase().includes(busqueda.toLowerCase())
      && !tramite.rut_ciudadano.includes(busqueda)) return false;
    return true;
  });

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="agenda-content">
            <h1 className="agenda-title">Agenda</h1>
            <div className="agenda-filters">
              <IonSearchbar
                className="filter-search"
                placeholder="Buscar por RUT / Nombre"
                value={busqueda}
                onIonInput={(e) => setBusqueda(e.detail.value ?? '')}
              />
              <IonSelect
                className="filter-select"
                aria-label="Filtrar por estado"
                interface="popover"
                value={filtroEstado}
                onIonChange={(e) => setFiltroEstado(e.detail.value)}
              >
                <IonSelectOption value="">Todos los estados</IonSelectOption>
                {estados.map((e) => (
                  <IonSelectOption key={e.id_estado_tramite} value={String(e.id_estado_tramite)}>
                    {e.nombre_estado_tramite}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <IonSelect
                className="filter-select"
                aria-label="Filtrar por tramite"
                interface="popover"
                value={filtroTramite}
                onIonChange={(e) => setFiltroTramite(e.detail.value)}
              >
                <IonSelectOption value="">Todos los tramites</IonSelectOption>
                {tipos.map((t) => (
                  <IonSelectOption key={t.id_tipo_tramite} value={String(t.id_tipo_tramite)}>
                    {t.nombre_tipo_tramite}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
            {cargando && <IonSpinner name="crescent" />}
            {!cargando && error && <p>{error}</p>}
            {!cargando && !error && citasFiltradas.length === 0 && <p>No hay citas</p>}
            <table className="agenda-table">
              <thead>
                <tr><th>Fecha y hora</th><th>RUT</th><th>Nombre</th><th>Tramite</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {!cargando && citasFiltradas.map(({ cita, tramite }) => (
                  <tr key={cita.id_cita}>
                    <td className="td-hora">
                      {formatear(cita.fecha, { day: 'numeric', month: 'short' })} {cita.hora_inicio.slice(0, 5)}
                    </td>
                    <td>{tramite.rut_ciudadano}</td>
                    <td>{tramite.nombre_ciudadano}</td>
                    <td>{tramite.nombre_tipo_tramite}</td>
                    <td>
                      <span className={`estado-label ${claseEstado(tramite.id_estado_tramite)}`}>
                        {tramite.nombre_estado_tramite}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={tramite.id_estado_tramite === ID_RECHAZADO ? '/funcionario/agenda/error' : '/funcionario/agenda/proceso'}
                        className="link-action"
                      >
                        Ver proceso del tramite
                      </Link>
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
