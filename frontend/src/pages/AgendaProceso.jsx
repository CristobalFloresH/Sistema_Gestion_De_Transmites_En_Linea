import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner, useIonToast, useIonAlert, useIonViewWillEnter } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { obtenerTramite, listarTramites, cambiarEstadoTramite } from '../services/tramiteService';
import { listarDocumentos } from '../services/documentoService';
import { listarCitasVigentes, cancelarCita } from '../services/citaService';
import { formatear, hoyIso } from '../utils/fechas';
import {
  ID_CITA_RESERVADA, ID_LISTA_PARA_RETIRO, ID_RECHAZADO,
  etapasDe, pasoActual, siguienteEstado, nombreEtapa,
} from '../utils/etapas';
import IconoPDF from '../assets/PDF.png';
import './AgendaProceso.css';

// Cuantos tramites del historial se muestran antes de "Ver todos"
const HISTORIAL_RESUMIDO = 3;

// Lo que el funcionario revisa en los documentos antes de aprobar (no se guarda en la base)
const CHECKS = [
  'Los datos coinciden con el RUT del ciudadano',
  'Los documentos son legibles y estan completos',
  'Los documentos estan vigentes',
];
const CHECKS_SIN_MARCAR = CHECKS.map(() => false);

// Clase de color del estado en el historial
function claseHistorial(idEstado) {
  if (idEstado === ID_RECHAZADO) return 'rechazado';
  if (idEstado === ID_LISTA_PARA_RETIRO) return 'completado';
  return 'proceso';
}

export default function AgendaProceso() {
  const [mostrarAviso] = useIonToast();
  const [mostrarAlerta] = useIonAlert();
  const { idTramite } = useParams();
  const [tramite, setTramite] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [otrosTramites, setOtrosTramites] = useState([]);
  const [verTodoHistorial, setVerTodoHistorial] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [checks, setChecks] = useState(CHECKS_SIN_MARCAR);
  const [guardando, setGuardando] = useState(false);

  const cargar = () => {
    setCargando(true);
    setError('');
    obtenerTramite(idTramite)
      .then((datosTramite) => Promise.all([
        datosTramite,
        listarDocumentos(datosTramite.id_tramite),
        listarTramites({ rut_ciudadano: datosTramite.rut_ciudadano }),
      ]))
      .then(([datosTramite, datosDocumentos, datosTramites]) => {
        setTramite(datosTramite);
        setDocumentos(datosDocumentos);
        setOtrosTramites(datosTramites.filter((t) => t.id_tramite !== datosTramite.id_tramite));
      })
      .catch((e) => {
        setTramite(null);
        setError(e.mensaje);
      })
      .finally(() => setCargando(false));
  };

  // Ionic deja la pagina montada: se recargan los datos al entrar. Va con [idTramite]
  // para que, al abrir otro tramite, no se quede con el id del anterior
  useIonViewWillEnter(() => {
    setVerTodoHistorial(false);
    setChecks(CHECKS_SIN_MARCAR);
    cargar();
  }, [idTramite]);

  const marcarCheck = (indice) => {
    setChecks(checks.map((marcado, i) => (i === indice ? !marcado : marcado)));
  };

  // "Aprobar" (desde Cita reservada) exige los 3 checks; "Avanzar a" las etapas siguientes no
  const siguiente = tramite ? siguienteEstado(tramite.id_tipo_tramite, tramite.id_estado_tramite) : null;
  const esAprobacion = tramite?.id_estado_tramite === ID_CITA_RESERVADA;
  const puedeAvanzar = !guardando && (!esAprobacion || checks.every(Boolean));
  // Si el tramite ya se aprobo, los documentos ya se revisaron: los checks se muestran marcados y fijos
  const documentosValidados = tramite
    && tramite.id_estado_tramite !== ID_CITA_RESERVADA && tramite.id_estado_tramite !== ID_RECHAZADO;

  const avanzar = async () => {
    setGuardando(true);
    try {
      await cambiarEstadoTramite(tramite.id_tramite, siguiente);
      const mensaje = esAprobacion ? 'Tramite aprobado' : `Tramite avanzado a ${nombreEtapa(siguiente)}`;
      mostrarAviso({ message: mensaje, duration: 2000, color: 'success' });
      setChecks(CHECKS_SIN_MARCAR);
      cargar();
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 3000, color: 'danger' });
    } finally {
      setGuardando(false);
    }
  };

  const rechazar = async () => {
    setGuardando(true);
    try {
      // Primero se cancela la cita (solo si todavia no ocurre) para liberar el cupo; despues se rechaza.
      // Si el rechazo fallara, el boton sigue disponible y al reintentar ya no hay cita que cancelar
      const cita = (await listarCitasVigentes()).find((c) => c.id_tramite === tramite.id_tramite);
      if (cita && cita.fecha > hoyIso()) await cancelarCita(cita.id_cita);
      await cambiarEstadoTramite(tramite.id_tramite, ID_RECHAZADO);
      mostrarAviso({ message: 'Tramite rechazado', duration: 2000, color: 'danger' });
      cargar();
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 3000, color: 'danger' });
    } finally {
      setGuardando(false);
    }
  };

  const confirmarRechazo = () => {
    mostrarAlerta({
      header: 'Rechazar tramite',
      message: 'El tramite quedara rechazado y, si su cita aun no ocurre, se liberara la hora.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Rechazar', role: 'destructive', handler: rechazar },
      ],
    });
  };

  // Los mas recientes primero (el backend ya los entrega asi)
  const historialVisible = verTodoHistorial ? otrosTramites : otrosTramites.slice(0, HISTORIAL_RESUMIDO);

  // El PDF no se sube todavia: "ver" muestra los datos que si estan guardados
  const verDocumento = (documento) => {
    const motivo = documento.motivo_rechazo ? ` · Motivo: ${documento.motivo_rechazo}` : '';
    mostrarAlerta({
      header: documento.nombre_tipo_documento,
      subHeader: documento.nombre_archivo,
      message: `Subido el ${formatear(documento.fecha_subida.slice(0, 10), { day: 'numeric', month: 'short', year: 'numeric' })}`
        + ` · Estado: ${documento.nombre_estado_documento}${motivo}.`
        + ' La vista previa del PDF estara disponible cuando se implemente la subida real de archivos.',
      buttons: ['Cerrar'],
    });
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="proceso-content">
            <div className="proceso-breadcrumb">
              <Link to="/funcionario/agenda" className="proceso-breadcrumb__link">Agenda</Link>
              <span> &gt; </span>
              <span>
                Proceso del tramite
                {tramite && ` · ${tramite.nombre_ciudadano} (${tramite.rut_ciudadano}) · ${tramite.nombre_tipo_tramite}`}
              </span>
            </div>
            {cargando && <IonSpinner name="crescent" />}
            {!cargando && error && <p>{error}</p>}
            {!cargando && tramite && (
            <>
            <div className="proceso-progress">
              {tramite.id_estado_tramite === ID_RECHAZADO
                ? <p className="historial-estado rechazado">Rechazado</p>
                : (
                  <ProgressBar
                    etapas={etapasDe(tramite.id_tipo_tramite)}
                    currentStep={pasoActual(tramite.id_tipo_tramite, tramite.id_estado_tramite)}
                  />
                )}
            </div>
            <div className="proceso-panels">
              <div className="proceso-panel">
                <h3>Documentos adjuntados</h3>
                <div className="doc-list">
                  {documentos.length === 0 && <p>Sin documentos</p>}
                  {documentos.map((d) => (
                    <div key={d.id_documento} className="doc-item">
                      <span>{d.nombre_tipo_documento}: {d.nombre_archivo} ({d.nombre_estado_documento})</span>
                      <a
                        href="#"
                        className="link-action"
                        onClick={(e) => { e.preventDefault(); verDocumento(d); }}>
                        ver
                      </a>
                    </div>
                  ))}
                </div>
                <div className="doc-icons">
                  {documentos.map((d) => (
                    <div key={d.id_documento} className="pdf-icon">
                      <img src={IconoPDF} alt="PDF" />
                      <small>{d.nombre_tipo_documento}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="proceso-panel">
                <h3>Validar veracidad de los documentos</h3>
                <ul className="validacion-list">
                  {CHECKS.map((texto, i) => {
                    const marcado = documentosValidados || checks[i];
                    return (
                      <li
                        key={texto}
                        className={marcado ? 'ok' : 'error'}
                        style={esAprobacion ? { cursor: 'pointer' } : undefined}
                        onClick={esAprobacion ? () => marcarCheck(i) : undefined}>
                        <IonIcon icon={marcado ? checkmarkCircle : closeCircle} /> {texto}
                      </li>
                    );
                  })}
                </ul>
                {siguiente && (
                  <div className="validacion-actions">
                    <IonButton
                      className="btn-validacion rechazar"
                      disabled={guardando}
                      onClick={confirmarRechazo}>
                      Rechazar
                    </IonButton>
                    <IonButton
                      className="btn-validacion aprobar"
                      disabled={!puedeAvanzar}
                      onClick={avanzar}>
                      {esAprobacion ? 'Aprobar' : `Avanzar a: ${nombreEtapa(siguiente)}`}
                    </IonButton>
                  </div>
                )}
                <div className="historial">
                  <h4>Historial de tramites</h4>
                  {otrosTramites.length === 0 && <p>Sin otros tramites</p>}
                  {historialVisible.map((t) => (
                    <div key={t.id_tramite} className="historial-item">
                      <span>{t.nombre_tipo_tramite} {t.fecha_inicio.slice(0, 4)}</span>
                      <span className={`historial-estado ${claseHistorial(t.id_estado_tramite)}`}>
                        {t.nombre_estado_tramite}
                      </span>
                    </div>
                  ))}
                  {otrosTramites.length > HISTORIAL_RESUMIDO && (
                    <a
                      href="#"
                      className="link-action"
                      onClick={(e) => { e.preventDefault(); setVerTodoHistorial(!verTodoHistorial); }}>
                      {verTodoHistorial ? 'Ver menos' : `Ver todos (${otrosTramites.length})`}
                    </a>
                  )}
                </div>
              </div>
            </div>
            </>
            )}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
