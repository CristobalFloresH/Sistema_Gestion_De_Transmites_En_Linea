import {
  IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonBadge, IonSpinner, useIonViewWillEnter, useIonAlert, useIonToast,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { useState } from 'react';
import { listarTramites, obtenerTramite } from '../services/tramiteService';
import { listarCitas, cancelarCita } from '../services/citaService';
import { getUsuario } from '../services/authService';
import { formatear, hoyIso } from '../utils/fechas';
import { ID_CITA_RESERVADA, ID_LISTA_PARA_RETIRO, ID_RECHAZADO, etapasDe, pasoActual, buscarCitaCancelada } from '../utils/etapas';
import './MisTramites.css';

// "20 oct 2026, 09:00"
function textoCita(cita) {
  return `${formatear(cita.fecha, { day: 'numeric', month: 'short', year: 'numeric' })}, ${cita.hora_inicio.slice(0, 5)}`;
}

// Clase de color de la etiqueta segun el estado
function claseEstado(idEstado) {
  if (idEstado === ID_RECHAZADO) return 'rechazado';
  if (idEstado === ID_LISTA_PARA_RETIRO) return 'aprobado';
  return 'proceso';
}

export default function MisTramites() {
  const [tramites, setTramites] = useState([]);
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarAlerta] = useIonAlert();
  const [mostrarAviso] = useIonToast();

  const cargar = () => {
    setCargando(true);
    setError('');
    // Siempre los de quien inicio sesion: a un funcionario el backend le devolveria los de todos
    const propios = { rut_ciudadano: getUsuario().rut };
    // Todas las citas (tambien las canceladas), para saber si un tramite se quedo sin hora porque se cancelo
    Promise.all([listarTramites(propios), listarCitas(propios)])
      .then(([datosTramites, datosCitas]) => {
        setTramites(datosTramites);
        setCitas(datosCitas);
      })
      .catch((e) => setError(e.mensaje))
      .finally(() => setCargando(false));
  };

  // Ionic deja la pagina montada: se recargan los datos cada vez que se entra
  useIonViewWillEnter(() => {
    cargar();
  });

  const citaDe = (idTramite) => citas.find((c) => c.id_tramite === idTramite && c.vigente);

  const citaCanceladaDe = (tramite) => buscarCitaCancelada(tramite, citas);
  const estadoVisible = (tramite) => (citaCanceladaDe(tramite) ? 'Cita cancelada' : tramite.nombre_estado_tramite);

  // La cita solo se puede cancelar o mover antes de que ocurra y mientras el tramite no se haya aprobado
  const puedeCambiarCita = (tramite, cita) =>
    cita && tramite.id_estado_tramite === ID_CITA_RESERVADA && cita.fecha > hoyIso();

  const cancelar = async (cita) => {
    try {
      await cancelarCita(cita.id_cita);
      mostrarAviso({ message: 'Cita cancelada', duration: 2000, color: 'success' });
      cargar();
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 3000, color: 'danger' });
    }
  };

  const confirmarCancelacion = (cita) => {
    mostrarAlerta({
      header: 'Cancelar cita',
      message: `¿Cancelar tu cita del ${textoCita(cita)}? El tramite quedara sin hora.`,
      buttons: [
        { text: 'Volver', role: 'cancel' },
        { text: 'Cancelar cita', role: 'destructive', handler: () => cancelar(cita) },
      ],
    });
  };

  // Muestra la cita y la linea de tiempo del tramite (su historial de estados)
  const verDetalles = async (tramite, cita) => {
    try {
      const { historial } = await obtenerTramite(tramite.id_tramite);
      const lineaDeTiempo = historial
        .map((h) => `${formatear(h.fecha.slice(0, 10), { day: 'numeric', month: 'short' })}: ${h.nombre_estado_tramite}`)
        .join(' · ');
      const cancelada = citaCanceladaDe(tramite);
      let textoDeCita = 'Sin cita vigente.';
      if (cita) textoDeCita = `Cita: ${textoCita(cita)} · Aviso por ${cita.nombre_metodo_notificacion}.`;
      if (cancelada) textoDeCita = `Cita cancelada (era el ${textoCita(cancelada)}).`;
      mostrarAlerta({
        header: tramite.nombre_tipo_tramite,
        subHeader: estadoVisible(tramite),
        message: `${textoDeCita} Historial: ${lineaDeTiempo}`,
        buttons: ['Cerrar'],
      });
    } catch (e) {
      mostrarAviso({ message: e.mensaje, duration: 3000, color: 'danger' });
    }
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
            <div className="tramites-list">
              {cargando && <IonSpinner name="crescent" />}
              {!cargando && error && <p>{error}</p>}
              {!cargando && !error && tramites.length === 0 && <p>Aún no tienes trámites</p>}
              {!cargando && tramites.map((t) => {
                const cita = citaDe(t.id_tramite);
                const cancelada = citaCanceladaDe(t);
                return (
                  <IonCard key={t.id_tramite} className="tramite-card">
                    <IonCardHeader className="tramite-card__header">
                      <div>
                        <IonCardTitle className="tramite-card__titulo">{t.nombre_tipo_tramite}</IonCardTitle>
                        <IonCardSubtitle className="tramite-card__fecha">
                          {cita && `Cita: ${textoCita(cita)}`}
                          {cancelada && `Cita cancelada: ${textoCita(cancelada)}`}
                          {!cita && !cancelada && 'Sin cita vigente'}
                        </IonCardSubtitle>
                      </div>
                      <IonBadge className={`tramite-badge ${cancelada ? 'rechazado' : claseEstado(t.id_estado_tramite)}`}>
                        {estadoVisible(t)}
                      </IonBadge>
                    </IonCardHeader>
                    {t.id_estado_tramite !== ID_RECHAZADO && (
                      <IonCardContent className="tramite-card__contenido">
                        <ProgressBar
                          etapas={etapasDe(t.id_tipo_tramite)}
                          currentStep={pasoActual(t.id_tipo_tramite, t.id_estado_tramite)}
                        />
                        <div className="tramite-card__actions">
                          {puedeCambiarCita(t, cita) && (
                            <>
                              <IonButton className="btn-tramite cancel" onClick={() => confirmarCancelacion(cita)}>
                                Cancelar cita
                              </IonButton>
                              <IonButton className="btn-tramite" routerLink={`/calendario?reagendar=${cita.id_cita}`}>
                                Reagendar
                              </IonButton>
                            </>
                          )}
                          <IonButton className="btn-tramite" onClick={() => verDetalles(t, cita)}>Ver detalles</IonButton>
                        </div>
                      </IonCardContent>
                    )}
                  </IonCard>
                );
              })}
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
