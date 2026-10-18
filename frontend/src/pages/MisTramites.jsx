import {
  IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonBadge, IonSpinner, useIonViewWillEnter,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { useState } from 'react';
import { listarTramites } from '../services/tramiteService';
import { listarCitasVigentes } from '../services/citaService';
import { formatear } from '../utils/fechas';
import './MisTramites.css';

// Ids del catalogo estado_tramite (licencias.sql)
const ID_LISTA_PARA_RETIRO = 6;
const ID_RECHAZADO = 7;

const ACCIONES = ['Cancelar cita', 'Reagendar', 'Ver detalles'];

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

  // Ionic deja la pagina montada: se recargan los datos cada vez que se entra
  useIonViewWillEnter(() => {
    setCargando(true);
    setError('');
    Promise.all([listarTramites(), listarCitasVigentes()])
      .then(([datosTramites, datosCitas]) => {
        setTramites(datosTramites);
        setCitas(datosCitas);
      })
      .catch((e) => setError(e.mensaje))
      .finally(() => setCargando(false));
  });

  const citaDe = (idTramite) => citas.find((c) => c.id_tramite === idTramite);

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
                return (
                  <IonCard key={t.id_tramite} className="tramite-card">
                    <IonCardHeader className="tramite-card__header">
                      <div>
                        <IonCardTitle className="tramite-card__titulo">{t.nombre_tipo_tramite}</IonCardTitle>
                        <IonCardSubtitle className="tramite-card__fecha">
                          {cita
                            ? `Cita: ${formatear(cita.fecha, { day: 'numeric', month: 'short', year: 'numeric' })}, ${cita.hora_inicio.slice(0, 5)}`
                            : 'Sin cita vigente'}
                        </IonCardSubtitle>
                      </div>
                      <IonBadge className={`tramite-badge ${claseEstado(t.id_estado_tramite)}`}>
                        {t.nombre_estado_tramite}
                      </IonBadge>
                    </IonCardHeader>
                    {t.id_estado_tramite !== ID_RECHAZADO && (
                      <IonCardContent className="tramite-card__contenido">
                        <ProgressBar currentStep={t.id_estado_tramite - 1} />
                        {cita && (
                          <div className="tramite-card__actions">
                            {ACCIONES.map((a, j) => (
                              <IonButton key={a} className={`btn-tramite ${j === 0 ? 'cancel' : ''}`}>{a}</IonButton>
                            ))}
                          </div>
                        )}
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
