import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  IonPage, IonContent, IonButton, IonIcon, IonTextarea, IonSpinner, useIonToast, useIonViewWillEnter,
} from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import IconoPDF from '../assets/PDF.png';
import { obtenerTramite, listarTramites } from '../services/tramiteService';
import { listarDocumentos } from '../services/documentoService';
import { etapasDe, pasoActual, ID_LISTA_PARA_RETIRO, ID_RECHAZADO } from '../utils/etapas';
import './AgendaProceso.css';

// Estados del catalogo estado_documento
const ID_DOCUMENTO_RECHAZADO = 3;

// Color del badge segun el estado en que va el tramite
function claseEstado(idEstadoTramite) {
  if (idEstadoTramite === ID_RECHAZADO) return 'rechazado';
  if (idEstadoTramite === ID_LISTA_PARA_RETIRO) return 'aprobado';
  return 'pendiente';
}

function Check({ ok, children }) {
  return (
    <li className={ok ? 'ok' : 'error'}>
      <IonIcon icon={ok ? checkmarkCircle : closeCircle} /> {children}
    </li>
  );
}

export default function AgendaProceso() {
  const { idTramite } = useParams();
  const [mostrarAviso] = useIonToast();
  const [motivo, setMotivo] = useState('');
  const [tramite, setTramite] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [otrosTramites, setOtrosTramites] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Trae el tramite con su historial, sus documentos y los demas tramites del mismo ciudadano
  useIonViewWillEnter(() => {
    setCargando(true);
    setError('');
    obtenerTramite(Number(idTramite))
      .then(async (datos) => {
        setTramite(datos);
        const [susDocumentos, susTramites] = await Promise.all([
          listarDocumentos(datos.id_tramite),
          listarTramites({ rut_ciudadano: datos.rut_ciudadano }),
        ]);
        setDocumentos(susDocumentos);
        setOtrosTramites(susTramites);
      })
      .catch((e) => { setTramite(null); setError(e.mensaje); })
      .finally(() => setCargando(false));
  });

  const hayRechazado = documentos.some((documento) => documento.id_estado_documento === ID_DOCUMENTO_RECHAZADO);

  const avisarPendiente = () => mostrarAviso({
    message: 'Aprobar y rechazar documentos todavia no esta disponible',
    duration: 2500,
    color: 'warning',
  });

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="proceso-content">
            <div className="proceso-breadcrumb">
              <Link to="/funcionario/agenda" className="proceso-breadcrumb__link">Agenda</Link>
              <span className="proceso-breadcrumb__sep"> &gt; </span>
              <span className="proceso-breadcrumb__actual">Proceso del tramite</span>
            </div>

            {cargando && <IonSpinner name="crescent" />}
            {!cargando && error && <p>{error}</p>}

            {!cargando && tramite && (
              <>
                <div className="proceso-resumen">
                  <div className="proceso-resumen__head">
                    <h2>{tramite.nombre_tipo_tramite}</h2>
                    <span className={`pill ${claseEstado(tramite.id_estado_tramite)}`}>
                      {tramite.nombre_estado_tramite}
                    </span>
                  </div>
                  <p>{tramite.nombre_ciudadano} · {tramite.rut_ciudadano}</p>
                  <ProgressBar
                    steps={etapasDe(tramite.id_tipo_tramite)}
                    currentStep={pasoActual(tramite.id_tipo_tramite, tramite.id_estado_tramite)}
                  />
                </div>

                <div className="proceso-panels">
                  <div className={`proceso-panel ${hayRechazado ? 'con-error' : ''}`}>
                    <h3>Documentos adjuntados</h3>
                    <div className="doc-list">
                      {documentos.length === 0 && <p>Este tramite todavia no tiene documentos</p>}
                      {documentos.map((documento) => (
                        <div key={documento.id_documento} className="doc-item">
                          <img src={IconoPDF} alt="PDF" />
                          <div className="doc-item__info">
                            <strong>{documento.nombre_archivo}</strong>
                            <small>
                              {documento.nombre_tipo_documento}
                              {documento.motivo_rechazo ? ` · ${documento.motivo_rechazo}` : ''}
                            </small>
                          </div>
                          {documento.id_estado_documento === ID_DOCUMENTO_RECHAZADO && (
                            <span className="doc-item__badge">{documento.nombre_estado_documento}</span>
                          )}
                          {/* La subida y la descarga del PDF son los pasos siguientes de la entrega */}
                          <a
                            href="#"
                            className="doc-item__ver"
                            onClick={(e) => {
                              e.preventDefault();
                              mostrarAviso({ message: 'Ver el PDF todavia no esta disponible', duration: 2500, color: 'warning' });
                            }}>
                            Ver
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`proceso-panel ${hayRechazado ? 'con-error' : ''}`}>
                    <h3>Validar veracidad de los documentos</h3>
                    <ul className="validacion-list">
                      <Check ok={!hayRechazado}>Datos coinciden con el RUT</Check>
                      <Check ok={!hayRechazado}>Documento legible</Check>
                      <Check ok>Cumple normativa vigente</Check>
                    </ul>
                    <p className="motivo-label">Motivo del rechazo</p>
                    <IonTextarea
                      className="motivo-input"
                      placeholder="Explicar que debe corregir el ciudadano"
                      rows={3}
                      value={motivo}
                      onIonInput={(e) => setMotivo(e.detail.value ?? '')}
                    />
                    <div className="validacion-actions">
                      <IonButton className="btn-validacion rechazar" onClick={avisarPendiente}>Rechazar</IonButton>
                      <IonButton className="btn-validacion aprobar" onClick={avisarPendiente}>Aceptar</IonButton>
                    </div>
                    <div className="historial">
                      <h4>Historial de tramites</h4>
                      {otrosTramites.map((otro) => (
                        <div key={otro.id_tramite} className="historial-item">
                          <span>
                            {otro.nombre_tipo_tramite} {otro.fecha_inicio.slice(0, 4)}
                            {otro.id_tramite === tramite.id_tramite ? ' (este)' : ''}
                          </span>
                          <span className={`pill ${claseEstado(otro.id_estado_tramite)}`}>
                            {otro.nombre_estado_tramite}
                          </span>
                        </div>
                      ))}
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
