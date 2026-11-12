import { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonSpinner, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonDatetime, IonItem, IonLabel, IonRadio, IonRadioGroup, useIonAlert, useIonToast, useIonViewWillEnter,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { listarTramites } from '../services/tramiteService';
import { listarCitas, crearCita, cancelarCita, reagendarCita, descargarComprobante } from '../services/citaService';
import { listarBloquesPorFecha } from '../services/bloqueHorarioService';
import { listarDocumentos, crearDocumento } from '../services/documentoService';
import { etapasDe, pasoActual, ID_LISTA_PARA_RETIRO, ID_RECHAZADO } from '../utils/etapas';
import {
  vigentesPorTipo, ID_DOCUMENTO_APROBADO, ID_DOCUMENTO_RECHAZADO,
} from '../utils/documentos';
import { formatear, hoyIso } from '../utils/fechas';
import './MisTramites.css';

// Color del badge segun el estado en que va el tramite
function claseEstado(idEstadoTramite) {
  if (idEstadoTramite === ID_RECHAZADO) return 'rechazado';
  if (idEstadoTramite === ID_LISTA_PARA_RETIRO) return 'aprobado';
  return 'pendiente';
}

// Color del badge segun como quedo la revision del documento
function claseEstadoDocumento(idEstadoDocumento) {
  if (idEstadoDocumento === ID_DOCUMENTO_RECHAZADO) return 'rechazado';
  if (idEstadoDocumento === ID_DOCUMENTO_APROBADO) return 'aprobado';
  return 'pendiente';
}

// Dia y hora de la cita en texto, por ejemplo "martes 10 de noviembre, 09:30"
function textoCita(cita) {
  const dia = formatear(cita.fecha, { weekday: 'long', day: 'numeric', month: 'long' });
  return `${dia}, ${cita.hora_inicio.slice(0, 5)}`;
}

export default function MisTramites() {
  const [mostrarAviso] = useIonToast();
  const [confirmar] = useIonAlert();
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  // Tramite que se esta agendando en el modal: con cita se reagenda, sin cita se pide una hora nueva
  const [enModal, setEnModal] = useState(null);
  const [fechaModal, setFechaModal] = useState(hoyIso());
  const [bloques, setBloques] = useState([]);
  const [cargandoBloques, setCargandoBloques] = useState(false);
  const [idBloque, setIdBloque] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Trae los tramites del ciudadano y les pega su cita vigente (el backend solo le devuelve los suyos)
  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [susTramites, susCitas] = await Promise.all([listarTramites(), listarCitas()]);
      // Los documentos se piden tramite por tramite: a un ciudadano el backend le exige el id_tramite
      const documentosPorTramite = await Promise.all(susTramites.map((tramite) => listarDocumentos(tramite.id_tramite)));
      setTramites(susTramites.map((tramite, posicion) => {
        const delTramite = susCitas.filter((cita) => cita.id_tramite === tramite.id_tramite);
        return {
          ...tramite,
          cita: delTramite.find((cita) => cita.vigente),
          // Si cancelo, se reutiliza el canal que habia elegido al agendar la primera vez
          idMetodo: delTramite[0]?.id_metodo_notificacion ?? 1,
          // De cada tipo solo se muestra el documento mas reciente, que es el que vale
          documentos: vigentesPorTipo(documentosPorTramite[posicion]),
        };
      }));
    } catch (e) {
      setTramites([]);
      setError(e.mensaje);
    } finally {
      setCargando(false);
    }
  };

  // La pagina queda montada: se recarga cada vez que se entra para no mostrar datos viejos
  useIonViewWillEnter(cargar);

  // Pide los bloques de un dia para el modal de reagendamiento
  const elegirFecha = (fecha) => {
    setFechaModal(fecha);
    setIdBloque(null);
    setCargandoBloques(true);
    listarBloquesPorFecha(fecha)
      .then(setBloques)
      .catch(() => setBloques([]))
      .finally(() => setCargandoBloques(false));
  };

  const abrirModal = (tramite) => {
    setEnModal(tramite);
    elegirFecha(tramite.cita?.fecha ?? hoyIso());
  };

  const cerrarModal = () => {
    setEnModal(null);
    setBloques([]);
    setIdBloque(null);
  };

  // Mueve la cita al bloque elegido, o reserva una nueva si el tramite se quedo sin cita.
  // En los dos casos el backend revisa que el bloque tenga cupo y libera el anterior
  const confirmarHora = async () => {
    setGuardando(true);
    try {
      if (enModal.cita) await reagendarCita(enModal.cita.id_cita, idBloque);
      else await crearCita(enModal.id_tramite, idBloque, enModal.idMetodo);
      const mensaje = enModal.cita ? 'Cita reagendada' : 'Hora agendada';
      cerrarModal();
      await cargar();
      mostrarAviso({ message: mensaje, duration: 2000, color: 'success' });
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 4000, color: 'danger' });
    } finally {
      setGuardando(false);
    }
  };

  // Cuando le rechazan un documento, el ciudadano sube otro del mismo tipo: el rechazado no se borra
  // ni se edita, asi queda el registro de por que se rechazo
  const subirDeNuevo = async (tramite, documento, evento) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = ''; // permite volver a elegir el mismo archivo si algo falla
    if (!archivo) return;
    if (archivo.type !== 'application/pdf') {
      return mostrarAviso({ message: 'Solo se aceptan archivos PDF', duration: 3000, color: 'warning' });
    }
    setGuardando(true);
    try {
      await crearDocumento(tramite.id_tramite, documento.id_tipo_documento, archivo);
      await cargar();
      mostrarAviso({ message: 'Documento enviado, queda pendiente de revision', duration: 3000, color: 'success' });
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 4000, color: 'danger' });
    } finally {
      setGuardando(false);
    }
  };

  // Baja el comprobante en PDF de la cita de ese tramite
  const bajarComprobante = async (cita) => {
    try {
      await descargarComprobante(cita.id_cita);
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 4000, color: 'danger' });
    }
  };

  // Cancelar libera el cupo del bloque para otra persona, por eso se pide confirmacion
  const pedirCancelar = (cita) => {
    confirmar({
      header: 'Cancelar cita',
      message: `Vas a cancelar tu cita del ${textoCita(cita)}. El cupo queda libre para otra persona.`,
      buttons: [
        { text: 'Volver', role: 'cancel' },
        {
          text: 'Cancelar cita',
          role: 'destructive',
          handler: () => {
            cancelarCita(cita.id_cita)
              .then(() => cargar())
              .then(() => mostrarAviso({ message: 'Cita cancelada', duration: 2000, color: 'success' }))
              .catch((e) => mostrarAviso({ message: e.mensaje, duration: 4000, color: 'danger' }));
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="mis-tramites-content">
            <h1 className="mis-tramites-title">Mis tramites</h1>
            <p className="mis-tramites-subtitle">
              Aqui encontraras todos tus tramites en proceso, rechazados o aprobados
            </p>
            {cargando && <IonSpinner name="crescent" />}
            {!cargando && error && <p className="mis-tramites-subtitle">{error}</p>}
            {!cargando && !error && tramites.length === 0 && (
              <p className="mis-tramites-subtitle">Todavia no tienes tramites. Agenda una hora para empezar uno.</p>
            )}
            <div className="tramites-list">
              {tramites.map((tramite) => (
                <div key={tramite.id_tramite} className="tramite-card">
                  <div className="tramite-card__header">
                    <h2 className="tramite-card__titulo">{tramite.nombre_tipo_tramite}</h2>
                    <span className={`pill ${claseEstado(tramite.id_estado_tramite)}`}>
                      {tramite.nombre_estado_tramite}
                    </span>
                  </div>
                  <div className="tramite-card__contenido">
                    <ProgressBar
                      steps={etapasDe(tramite.id_tipo_tramite)}
                      currentStep={pasoActual(tramite.id_tipo_tramite, tramite.id_estado_tramite)}
                    />
                    <p className="mis-tramites-subtitle">
                      {tramite.cita ? `Cita: ${textoCita(tramite.cita)}` : 'Sin cita vigente'}
                    </p>
                    {tramite.documentos.length > 0 && (
                      <div className="tramite-card__docs">
                        {tramite.documentos.map((documento) => (
                          <div key={documento.id_documento} className="tramite-doc">
                            <span className="tramite-doc__nombre">{documento.nombre_tipo_documento}</span>
                            <span className={`pill ${claseEstadoDocumento(documento.id_estado_documento)}`}>
                              {documento.nombre_estado_documento}
                            </span>
                            {documento.id_estado_documento === ID_DOCUMENTO_RECHAZADO && (
                              <>
                                <span className="tramite-doc__motivo">{documento.motivo_rechazo}</span>
                                <label className="tramite-doc__subir">
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    hidden
                                    disabled={guardando}
                                    onChange={(e) => subirDeNuevo(tramite, documento, e)}
                                  />
                                  Subir de nuevo
                                </label>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="tramite-card__acciones">
                      <IonButton className="btn btn--outline" onClick={() => abrirModal(tramite)}>
                        {tramite.cita ? 'Reagendar' : 'Agendar otra hora'}
                      </IonButton>
                      {tramite.cita && (
                        <>
                          <IonButton className="btn btn--outline" onClick={() => pedirCancelar(tramite.cita)}>
                            Cancelar cita
                          </IonButton>
                          <IonButton className="btn btn--outline" onClick={() => bajarComprobante(tramite.cita)}>
                            Descargar comprobante
                          </IonButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        <IonModal isOpen={!!enModal} onDidDismiss={cerrarModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{enModal?.cita ? 'Reagendar cita' : 'Agendar hora'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={cerrarModal}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonDatetime
              presentation="date"
              min={hoyIso()}
              value={fechaModal}
              onIonChange={(e) => elegirFecha(String(e.detail.value).slice(0, 10))}
            />
            {cargandoBloques && <IonSpinner name="crescent" />}
            {!cargandoBloques && bloques.length === 0 && <p>No hay bloques disponibles para este dia</p>}
            <IonRadioGroup value={idBloque} onIonChange={(e) => setIdBloque(e.detail.value)}>
              {bloques.map((bloque) => (
                <IonItem key={bloque.id_bloque_horario} disabled={bloque.cupos_disponibles === 0}>
                  <IonLabel>
                    {bloque.hora_inicio.slice(0, 5)} · {bloque.cupos_disponibles} cupos
                  </IonLabel>
                  <IonRadio slot="end" value={bloque.id_bloque_horario} />
                </IonItem>
              ))}
            </IonRadioGroup>
            <IonButton expand="block" disabled={!idBloque || guardando} onClick={confirmarHora}>
              {guardando ? 'Guardando...' : 'Confirmar'}
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
