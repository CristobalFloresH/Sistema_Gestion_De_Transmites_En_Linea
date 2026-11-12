import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  IonPage, IonContent, IonButton, IonIcon, IonTextarea, IonSpinner, IonModal, IonHeader, IonToolbar,
  IonTitle, IonButtons, useIonToast, useIonViewWillEnter,
} from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import IconoPDF from '../assets/PDF.png';
import { obtenerTramite, listarTramites, cambiarEstadoTramite } from '../services/tramiteService';
import { listarDocumentos, abrirArchivo, revisarDocumento } from '../services/documentoService';
import { etapasDe, pasoActual, siguienteEstado, nombreEtapa, ID_LISTA_PARA_RETIRO, ID_RECHAZADO } from '../utils/etapas';
import {
  vigentesPorTipo, ID_DOCUMENTO_PENDIENTE, ID_DOCUMENTO_APROBADO, ID_DOCUMENTO_RECHAZADO,
} from '../utils/documentos';
import './AgendaProceso.css';

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
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  // Documento que se esta revisando en el panel derecho (null = el primero pendiente)
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  // PDF que se esta mirando: su direccion temporal en el navegador y el nombre con que lo subieron
  const [pdf, setPdf] = useState(null);

  // Trae el tramite con su historial, sus documentos y los demas tramites del mismo ciudadano
  const cargar = () => {
    setCargando(true);
    setError('');
    return obtenerTramite(Number(idTramite))
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
  };

  useIonViewWillEnter(cargar);

  // De cada tipo de documento solo cuenta el mas reciente, porque al rechazar uno el ciudadano sube otro
  const vigentes = vigentesPorTipo(documentos);
  const hayRechazado = vigentes.some((d) => d.id_estado_documento === ID_DOCUMENTO_RECHAZADO);
  // Si no se eligio ninguno, se revisa el primer pendiente que de verdad falta por revisar
  const seleccionado = documentos.find((d) => d.id_documento === idSeleccionado)
    ?? vigentes.find((d) => d.id_estado_documento === ID_DOCUMENTO_PENDIENTE);
  const seleccionadoRechazado = seleccionado?.id_estado_documento === ID_DOCUMENTO_RECHAZADO;
  const siguiente = tramite && siguienteEstado(tramite.id_tipo_tramite, tramite.id_estado_tramite);

  // Aprueba o rechaza el documento que se esta revisando y vuelve a leer los datos del tramite
  const revisar = async (idEstadoDocumento) => {
    if (idEstadoDocumento === ID_DOCUMENTO_RECHAZADO && !motivo.trim()) {
      return mostrarAviso({ message: 'Para rechazar un documento debes escribir el motivo', duration: 3000, color: 'warning' });
    }
    setGuardando(true);
    try {
      await revisarDocumento(seleccionado.id_documento, idEstadoDocumento, motivo.trim());
      setMotivo('');
      setIdSeleccionado(null); // vuelve al siguiente documento pendiente
      await cargar();
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 4000, color: 'danger' });
    } finally {
      setGuardando(false);
    }
  };

  // Hace avanzar el tramite a la etapa siguiente; el backend lo rechaza si falta algun documento por aprobar
  const avanzarTramite = async () => {
    setGuardando(true);
    try {
      await cambiarEstadoTramite(tramite.id_tramite, siguiente);
      mostrarAviso({ message: `El tramite avanzo a ${nombreEtapa(siguiente)}`, duration: 3000, color: 'success' });
      await cargar();
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 5000, color: 'danger' });
    } finally {
      setGuardando(false);
    }
  };

  // Trae el PDF y lo muestra dentro de la misma pagina, para no depender de que el navegador
  // permita ventanas emergentes
  const verArchivo = async (evento, documento) => {
    evento.preventDefault();
    try {
      const url = await abrirArchivo(documento.id_documento);
      setPdf({ url, nombre: documento.nombre_archivo });
    } catch (e) {
      const mensaje = e.status === 404 ? 'Este documento no tiene un archivo guardado' : e.mensaje;
      mostrarAviso({ message: mensaje, duration: 4000, color: 'danger' });
    }
  };

  // Al cerrar se libera la direccion temporal que el navegador creo para el archivo
  const cerrarPdf = () => {
    if (pdf) URL.revokeObjectURL(pdf.url);
    setPdf(null);
  };

  // Guarda una copia del PDF en el computador del funcionario
  const descargarPdf = () => {
    Object.assign(document.createElement('a'), { href: pdf.url, download: pdf.nombre }).click();
  };

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
                  {siguiente && (
                    <IonButton
                      className="btn-validacion aprobar"
                      disabled={guardando}
                      onClick={avanzarTramite}>
                      Aprobar tramite ({nombreEtapa(siguiente)})
                    </IonButton>
                  )}
                </div>

                <div className="proceso-panels">
                  <div className={`proceso-panel ${hayRechazado ? 'con-error' : ''}`}>
                    <h3>Documentos adjuntados</h3>
                    <div className="doc-list">
                      {documentos.length === 0 && <p>Este tramite todavia no tiene documentos</p>}
                      {documentos.map((documento) => (
                        <div
                          key={documento.id_documento}
                          className={`doc-item ${documento.id_documento === seleccionado?.id_documento ? 'seleccionado' : ''}`}
                          onClick={() => setIdSeleccionado(documento.id_documento)}>
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
                          <a
                            href="#"
                            className="doc-item__ver"
                            onClick={(e) => verArchivo(e, documento)}>
                            Ver
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`proceso-panel ${hayRechazado ? 'con-error' : ''}`}>
                    <h3>{seleccionado ? seleccionado.nombre_archivo : 'Validar veracidad de los documentos'}</h3>
                    <ul className="validacion-list">
                      <Check ok={!seleccionadoRechazado}>Datos coinciden con el RUT</Check>
                      <Check ok={!seleccionadoRechazado}>Documento legible</Check>
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
                      <IonButton
                        className="btn-validacion rechazar"
                        disabled={!seleccionado || guardando}
                        onClick={() => revisar(ID_DOCUMENTO_RECHAZADO)}>
                        Rechazar
                      </IonButton>
                      <IonButton
                        className="btn-validacion aprobar"
                        disabled={!seleccionado || guardando}
                        onClick={() => revisar(ID_DOCUMENTO_APROBADO)}>
                        Aceptar
                      </IonButton>
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

        <IonModal className="visor-pdf" isOpen={!!pdf} onDidDismiss={cerrarPdf}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{pdf?.nombre}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={descargarPdf}>Descargar</IonButton>
                <IonButton onClick={cerrarPdf}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <iframe className="visor-pdf__hoja" src={pdf?.url} title={pdf?.nombre} />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
