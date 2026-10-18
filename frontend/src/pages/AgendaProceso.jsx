import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner, useIonToast, useIonAlert, useIonViewWillEnter } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { obtenerTramite, listarTramites } from '../services/tramiteService';
import { listarDocumentos } from '../services/documentoService';
import { formatear } from '../utils/fechas';
import IconoPDF from '../assets/PDF.png';
import './AgendaProceso.css';

// Ids del catalogo estado_tramite (licencias.sql)
const ID_LISTA_PARA_RETIRO = 6;
const ID_RECHAZADO = 7;

// Cuantos tramites del historial se muestran antes de "Ver todos"
const HISTORIAL_RESUMIDO = 3;

// Clase de color del estado en el historial
function claseHistorial(idEstado) {
  if (idEstado === ID_RECHAZADO) return 'rechazado';
  if (idEstado === ID_LISTA_PARA_RETIRO) return 'completado';
  return 'proceso';
}

export default function AgendaProceso({ hasErrors = false }) {
  const [mostrarAviso] = useIonToast();
  const [mostrarAlerta] = useIonAlert();
  const { idTramite } = useParams();
  const [tramite, setTramite] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [otrosTramites, setOtrosTramites] = useState([]);
  const [verTodoHistorial, setVerTodoHistorial] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Ionic deja la pagina montada: se recargan los datos al entrar. Va con [idTramite]
  // para que, al abrir otro tramite, no se quede con el id del anterior
  useIonViewWillEnter(() => {
    setCargando(true);
    setError('');
    setVerTodoHistorial(false);
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
  }, [idTramite]);

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
                : <ProgressBar currentStep={tramite.id_estado_tramite - 1} />}
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
                  <li className={hasErrors ? 'error' : 'ok'}>
                    <IonIcon icon={hasErrors ? closeCircle : checkmarkCircle} /> Datos coinciden con RUT
                  </li>
                  <li className={hasErrors ? 'error' : 'ok'}>
                    <IonIcon icon={hasErrors ? closeCircle : checkmarkCircle} /> Documento legible
                  </li>
                  <li className="ok"><IonIcon icon={checkmarkCircle} /> Cumple normativa vigente</li>
                </ul>
                <div className="validacion-actions">
                  <IonButton
                    className="btn-validacion rechazar"
                    onClick={() => mostrarAviso({ message: 'Tramite rechazado', duration: 2000, color: 'danger' })}>
                    Rechazar
                  </IonButton>
                  <IonButton
                    className="btn-validacion aprobar"
                    onClick={() => mostrarAviso({ message: 'Tramite aprobado', duration: 2000, color: 'success' })}>
                    Aprobar
                  </IonButton>
                </div>
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
