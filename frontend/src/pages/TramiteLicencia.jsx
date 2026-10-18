
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonSegment, IonSegmentButton, IonLabel, IonSpinner, IonText, useIonViewWillEnter } from '@ionic/react';
import NavBar from '../components/NavBar';
import { listarTiposTramite, listarMetodosNotificacion } from '../services/catalogoService';
import { listarBloquesPorFecha } from '../services/bloqueHorarioService';
import { crearTramite } from '../services/tramiteService';
import { crearCita } from '../services/citaService';
import { crearDocumento } from '../services/documentoService';
import { getUsuario } from '../services/authService';
import { formatear } from '../utils/fechas';
import ImagenCalendario from '../assets/ImagenCalendario.png';
import './TramiteLicencia.css';

// Las 7 fechas desde hoy, en formato AAAA-MM-DD (el que pide el backend)
function proximosSieteDias() {
  return Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  });
}

export default function TramiteLicencia() {
  const [tipos, setTipos] = useState([]);
  const [tipoTramite, setTipoTramite] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [metodos, setMetodos] = useState([]);
  const [metodo, setMetodo] = useState('');
  // Archivo elegido para cada tipo de documento: { idTipoDocumento: File }
  const [archivos, setArchivos] = useState({});

  useEffect(() => {
    Promise.all([listarTiposTramite(), listarMetodosNotificacion()])
      .then(([datosTipos, datosMetodos]) => {
        setTipos(datosTipos);
        if (datosTipos.length > 0) setTipoTramite(String(datosTipos[0].id_tipo_tramite));
        setMetodos(datosMetodos);
        if (datosMetodos.length > 0) setMetodo(String(datosMetodos[0].id_metodo_notificacion));
      })
      .catch((e) => setError(e.mensaje))
      .finally(() => setCargando(false));
  }, []);

  const tipoSeleccionado = tipos.find((t) => String(t.id_tipo_tramite) === tipoTramite);
  const [reservando, setReservando] = useState(false);
  const [errorReserva, setErrorReserva] = useState('');
  const [tramiteCreado, setTramiteCreado] = useState(null);
  const [documentosGuardados, setDocumentosGuardados] = useState({});

  const faltanDocumentos = !tipoSeleccionado
    || tipoSeleccionado.documentos_requeridos.some((doc) => !archivos[doc.id_tipo_documento]);

  // Al cambiar de tramite se borran los archivos, porque cada tipo pide documentos distintos
  const cambiarTipo = (nuevoTipo) => {
    setTipoTramite(nuevoTipo);
    setArchivos({});
  };

  const elegirArchivo = (idTipoDocumento, archivo) => {
    if (!archivo) return;
    if (!archivo.name.toLowerCase().endsWith('.pdf')) {
      setErrorReserva('Solo se aceptan archivos PDF');
      return;
    }
    setErrorReserva('');
    setArchivos({ ...archivos, [idTipoDocumento]: archivo });
  };
  const [dias] = useState(proximosSieteDias);
  const [dia, setDia] = useState(dias[0]);
  const [bloque, setBloque] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [cargandoBloques, setCargandoBloques] = useState(true);
  const [errorBloques, setErrorBloques] = useState('');

  useEffect(() => {
    let vigente = true;
    listarBloquesPorFecha(dia)
      .then((datos) => { if (vigente) setBloques(datos); })
      .catch((e) => { if (vigente) { setBloques([]); setErrorBloques(e.mensaje); } })
      .finally(() => { if (vigente) setCargandoBloques(false); });
    return () => { vigente = false; };
  }, [dia]);

  const cambiarDia = (nuevoDia) => {
    setDia(nuevoDia);
    setBloque(null);
    setCargandoBloques(true);
    setErrorBloques('');
  };

  const navigate = useNavigate();

  const reservar = async () => {
    setReservando(true);
    setErrorReserva('');
    try {
      // Si un intento anterior ya creo el tramite, se reutiliza en vez de crear otro
      const tramite = tramiteCreado ?? await crearTramite(getUsuario().rut, Number(tipoTramite));
      setTramiteCreado(tramite);

      // Guarda solo los documentos que faltan (si un intento anterior guardo algunos, no se repiten)
      const guardados = { ...documentosGuardados };
      try {
        for (const doc of tipoSeleccionado.documentos_requeridos) {
          if (guardados[doc.id_tipo_documento]) continue;
          await crearDocumento(tramite.id_tramite, doc.id_tipo_documento, archivos[doc.id_tipo_documento].name);
          guardados[doc.id_tipo_documento] = true;
        }
      } finally {
        setDocumentosGuardados(guardados);
      }

      const cita = await crearCita(tramite.id_tramite, bloque.id_bloque_horario, Number(metodo));
      setTramiteCreado(null);
      setDocumentosGuardados({});
      navigate('/tramite-finalizado', { state: { tramite, cita } });
    } catch (e) {
      setErrorReserva(e.mensaje);
    } finally {
      setReservando(false);
    }
  };

  // Al volver desde el Calendario, toma la hora que se eligio alla
  useIonViewWillEnter(() => {
    const guardado = sessionStorage.getItem('bloqueElegido');
    if (!guardado) return;
    sessionStorage.removeItem('bloqueElegido');
    setBloque(JSON.parse(guardado));
  });


  return (
    <IonPage>
      <IonContent>
        <div className="page tramite-page">
          <NavBar />
          <main className="tramite-content">
            <h1 className="tramite-content__title">
              Tu licencia de conducir, gestionada en linea en la municipalidad de Santo Domingo
            </h1>
            <p className="tramite-content__subtitle">
              Agenda tu hora, sube tus documentos y sigue tu tramite desde un solo lugar.
            </p>

            <div className="tramite-step">
              <div className="step-badge">1</div>
              <div className="step-content">
                <h3>Seleccione el tipo de tramite a realizar</h3>
                {cargando && <IonSpinner name="crescent" />}
                {!cargando && error && <p>{error}</p>}
                {!cargando && !error && (
                  <IonSegment
                    className="tipo-tramite-options"
                    value={tipoTramite}
                    disabled={!!tramiteCreado}
                    onIonChange={(e) => cambiarTipo(e.detail.value)}>
                    {tipos.map((t) => (
                      <IonSegmentButton key={t.id_tipo_tramite} value={String(t.id_tipo_tramite)} className="tipo-btn">
                        <IonLabel>
                          <span className="tipo-btn__titulo">{t.nombre_tipo_tramite}</span>
                          <span className="tipo-btn__detalle">
                            {t.duracion_min} min · {t.documentos_requeridos.length} documentos
                          </span>
                        </IonLabel>
                      </IonSegmentButton>
                    ))}
                  </IonSegment>
                )}
              </div>
            </div>

            <div className="tramite-step">
              <div className="step-badge">2</div>
              <div className="step-content">
                <h3>Elija hora y dia</h3>
                <div className="fecha-selector">
                  <div className="fecha-box">
                    <p className="fecha-box__titulo">
                      {formatear(dia, { month: 'long', year: 'numeric' })}
                    </p>
                    <div className="dias-fila">
                      {dias.map((d) => (
                        <IonButton
                          key={d}
                          className={`opcion-btn ${dia === d ? 'selected' : ''}`}
                          onClick={() => cambiarDia(d)}>
                          {Number(d.slice(8, 10))}
                        </IonButton>
                      ))}
                    </div>
                  </div>
                  <div className="fecha-box">
                    <p className="fecha-box__titulo">
                      Bloques {formatear(dia, { day: 'numeric', month: 'long' })}
                    </p>
                    <div className="horas-grid">
                      {cargandoBloques && <IonSpinner name="crescent" />}
                      {!cargandoBloques && errorBloques && <p>{errorBloques}</p>}
                      {!cargandoBloques && !errorBloques && bloques.length === 0 && (
                        <p>No hay horas disponibles este día</p>
                      )}
                      {!cargandoBloques && bloques.map((b) => (
                        <IonButton
                          key={b.id_bloque_horario}
                          className={`opcion-btn opcion-btn--hora ${bloque?.id_bloque_horario === b.id_bloque_horario ? 'selected' : ''}`}
                          disabled={b.cupos_disponibles === 0}
                          onClick={() => setBloque(b)}>
                          {b.hora_inicio.slice(0, 5)}
                        </IonButton>
                      ))}
                    </div>
                  </div>
                  <Link to="/calendario" className="mas-horarios">
                    <strong>¿Buscas mas horarios?</strong>
                    <img src={ImagenCalendario} alt="Calendario" className="mas-horarios__icono" />
                    <small>Click aqui</small>
                  </Link>
                </div>
                {bloque && (
                  <p>
                    Hora elegida: {formatear(bloque.fecha, { weekday: 'long', day: 'numeric', month: 'long' })}, {bloque.hora_inicio.slice(0, 5)}
                  </p>
                )}
              </div>
            </div>

            <div className="tramite-step">
              <div className="step-badge">3</div>
              <div className="step-content">
                <h3>Carga tus documentos (PDF)</h3>
                <div className="docs-grid">
                  {tipoSeleccionado?.documentos_requeridos.map((doc) => {
                    const archivo = archivos[doc.id_tipo_documento];
                    return (
                      <label key={doc.id_tipo_documento} className={`doc-card ${archivo ? 'cargado' : ''}`}>
                        {doc.nombre_tipo_documento}
                        {archivo && <small style={{ display: 'block' }}>{archivo.name}</small>}
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          hidden
                          disabled={!!tramiteCreado}
                          onChange={(e) => {
                            elegirArchivo(doc.id_tipo_documento, e.target.files[0]);
                            e.target.value = ''; // permite volver a elegir el mismo archivo
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="tramite-step">
              <div className="step-badge">4</div>
              <div className="step-content">
                <h3>¿Cómo quieres que te avisemos?</h3>
                {!cargando && !error && (
                  <IonSegment
                    className="tipo-tramite-options"
                    value={metodo}
                    onIonChange={(e) => setMetodo(e.detail.value)}>
                    {metodos.map((m) => (
                      <IonSegmentButton key={m.id_metodo_notificacion} value={String(m.id_metodo_notificacion)} className="tipo-btn">
                        <IonLabel>
                          <span className="tipo-btn__titulo">{m.nombre_metodo_notificacion}</span>
                        </IonLabel>
                      </IonSegmentButton>
                    ))}
                  </IonSegment>
                )}
              </div>
            </div>

            {errorReserva && (
              <IonText color="danger">
                <p style={{ textAlign: 'center' }}>{errorReserva}</p>
              </IonText>
            )}
            <IonButton
              className="btn btn--green tramite-continuar"
              disabled={!tipoTramite || !bloque || !metodo || faltanDocumentos || reservando}
              onClick={reservar}>
              {reservando ? 'Reservando...' : 'Continuar'}
            </IonButton>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
