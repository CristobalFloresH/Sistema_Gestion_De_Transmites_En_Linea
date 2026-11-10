import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IonPage, IonContent, IonSearchbar, IonSelect, IonSelectOption, IonInput, IonSpinner,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { listarCitasVigentes } from '../services/citaService';
import { listarTramites } from '../services/tramiteService';
import { listarTiposTramite, listarEstadosTramite } from '../services/catalogoService';
import { ID_LISTA_PARA_RETIRO, ID_RECHAZADO } from '../utils/etapas';
import { hoyIso } from '../utils/fechas';
import './AgendaFuncionario.css';

// RUT normalizado, sin puntos y con guion, igual que en la base
const FORMATO_RUT = /^[0-9]{7,8}-[0-9Kk]$/;

// Color del badge segun el estado en que va el tramite
function claseEstado(idEstadoTramite) {
  if (idEstadoTramite === ID_RECHAZADO) return 'rechazado';
  if (idEstadoTramite === ID_LISTA_PARA_RETIRO) return 'aprobado';
  return 'pendiente';
}

// Junta los datos del tramite con los de su cita para armar una fila de la tabla
function armarFila(tramite, cita) {
  return {
    id_tramite: tramite.id_tramite,
    hora: cita ? cita.hora_inicio.slice(0, 5) : '—',
    rut: tramite.rut_ciudadano,
    nombre: tramite.nombre_ciudadano,
    id_tipo_tramite: tramite.id_tipo_tramite,
    tramite: tramite.nombre_tipo_tramite,
    id_estado_tramite: tramite.id_estado_tramite,
    estado: tramite.nombre_estado_tramite,
  };
}

export default function AgendaFuncionario() {
  const [fecha, setFecha] = useState(hoyIso());
  const [busqueda, setBusqueda] = useState('');
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTramite, setFiltroTramite] = useState('');

  // Si lo escrito en el buscador es un RUT, se pide ese expediente a la API; si no, se filtra en pantalla
  const rutBuscado = FORMATO_RUT.test(busqueda.trim()) ? busqueda.trim() : null;

  // Las opciones de los filtros salen de los catalogos, no de una lista escrita a mano
  useEffect(() => {
    Promise.all([listarTiposTramite(), listarEstadosTramite()])
      .then(([susTipos, susEstados]) => { setTipos(susTipos); setEstados(susEstados); })
      .catch(() => { setTipos([]); setEstados([]); });
  }, []);

  // Cambiar de dia o escribir un RUT completo vuelve a pedir los datos: se avisa antes de que corra el efecto
  const cambiarFecha = (nuevaFecha) => {
    setFecha(nuevaFecha || hoyIso());
    setCargando(true);
    setError('');
  };

  const cambiarBusqueda = (texto) => {
    const nuevoRut = FORMATO_RUT.test(texto.trim()) ? texto.trim() : null;
    if (nuevoRut !== rutBuscado) {
      setCargando(true);
      setError('');
    }
    setBusqueda(texto);
  };

  // Sin RUT se muestra la agenda del dia; con RUT, todos los tramites de esa persona aunque sean de otros dias
  useEffect(() => {
    let vigente = true;
    const filtros = rutBuscado ? { rut_ciudadano: rutBuscado } : { fecha };
    Promise.all([listarCitasVigentes(filtros), listarTramites(rutBuscado ? { rut_ciudadano: rutBuscado } : {})])
      .then(([citas, tramites]) => {
        if (!vigente) return;
        const porTramite = (idTramite) => tramites.find((t) => t.id_tramite === idTramite);
        const nuevasFilas = rutBuscado
          ? tramites.map((tramite) => armarFila(tramite, citas.find((c) => c.id_tramite === tramite.id_tramite)))
          : citas
            .filter((cita) => porTramite(cita.id_tramite))
            .map((cita) => armarFila(porTramite(cita.id_tramite), cita));
        setFilas(nuevasFilas);
      })
      .catch((e) => { if (vigente) { setFilas([]); setError(e.mensaje); } })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [fecha, rutBuscado]);

  // Filtros que se aplican sobre lo ya cargado: estado, tipo de tramite y el texto del buscador
  const filasFiltradas = filas.filter((fila) => {
    if (filtroEstado && fila.id_estado_tramite !== filtroEstado) return false;
    if (filtroTramite && fila.id_tipo_tramite !== filtroTramite) return false;
    if (busqueda && !rutBuscado) {
      const texto = busqueda.toLowerCase();
      if (!fila.nombre.toLowerCase().includes(texto) && !fila.rut.includes(texto)) return false;
    }
    return true;
  });

  // Un chip por cada estado que aparece en la agenda cargada, con su cantidad
  const contar = (idEstado) => filas.filter((fila) => fila.id_estado_tramite === idEstado).length;
  const chips = [
    { valor: '', texto: `Todos ${filas.length}` },
    ...estados
      .filter((estado) => contar(estado.id_estado_tramite) > 0)
      .map((estado) => ({
        valor: estado.id_estado_tramite,
        texto: `${estado.nombre_estado_tramite} ${contar(estado.id_estado_tramite)}`,
      })),
  ];

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
                placeholder="Buscar por RUT o nombre"
                value={busqueda}
                onIonInput={(e) => cambiarBusqueda(e.detail.value ?? '')}
              />
              <IonInput
                className="filter-select"
                type="date"
                aria-label="Dia de la agenda"
                disabled={!!rutBuscado}
                value={fecha}
                onIonChange={(e) => cambiarFecha(e.detail.value)}
              />
              <IonSelect
                className="filter-select"
                aria-label="Filtrar por estado"
                interface="popover"
                value={filtroEstado}
                onIonChange={(e) => setFiltroEstado(e.detail.value)}
              >
                <IonSelectOption value="">Todos los estados</IonSelectOption>
                {estados.map((estado) => (
                  <IonSelectOption key={estado.id_estado_tramite} value={estado.id_estado_tramite}>
                    {estado.nombre_estado_tramite}
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
                {tipos.map((tipo) => (
                  <IonSelectOption key={tipo.id_tipo_tramite} value={tipo.id_tipo_tramite}>
                    {tipo.nombre_tipo_tramite}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
            <div className="agenda-chips">
              {chips.map((chip) => (
                <button
                  type="button"
                  key={chip.valor}
                  className={`chip ${filtroEstado === chip.valor ? 'activo' : ''}`}
                  onClick={() => setFiltroEstado(chip.valor)}>
                  {chip.texto}
                </button>
              ))}
            </div>
            {rutBuscado && <p>Mostrando todos los tramites del RUT {rutBuscado}</p>}
            {cargando && <IonSpinner name="crescent" />}
            {!cargando && error && <p>{error}</p>}
            {!cargando && !error && filasFiltradas.length === 0 && (
              <p>No hay citas para mostrar con estos filtros</p>
            )}
            <table className="agenda-table">
              <thead>
                <tr><th>Hora</th><th>RUT</th><th>Nombre</th><th>Tramite</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {filasFiltradas.map((fila) => (
                  <tr key={fila.id_tramite}>
                    <td className="td-hora">{fila.hora}</td>
                    <td>{fila.rut}</td>
                    <td>{fila.nombre}</td>
                    <td>{fila.tramite}</td>
                    <td><span className={`pill ${claseEstado(fila.id_estado_tramite)}`}>{fila.estado}</span></td>
                    <td>
                      <Link to={`/funcionario/tramites/${fila.id_tramite}`} className="link-action">
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
