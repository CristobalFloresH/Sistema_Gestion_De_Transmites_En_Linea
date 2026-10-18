import { IonPage, IonContent, IonButton, useIonToast } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { formatear } from '../utils/fechas';
import NavBar from '../components/NavBar';
import './TramiteFinalizado.css';

export default function TramiteFinalizado() {
  const [mostrarAviso] = useIonToast();

  // Datos de la reserva que manda TramiteLicencia al navegar hasta aqui
  const { state } = useLocation();
  const tramite = state?.tramite;
  const cita = state?.cita;

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="finalizado-content">
            <div className="finalizado-card">
              {tramite ? (
                <>
                  <div className="finalizado-check">&#10003;</div>
                  <h2 className="finalizado-title">Proceso completado</h2>
                  <p className="finalizado-desc">
                    Tu tramite {tramite.nombre_tipo_tramite} quedo agendado correctamente
                  </p>
                  <div className="finalizado-info">
                    <span>{tramite.nombre_ciudadano}</span>
                    <span>&middot;</span>
                    <span>{tramite.rut_ciudadano}</span>
                    <span>&middot;</span>
                    <span>{tramite.nombre_tipo_tramite}</span>
                    <span>&middot;</span>
                    <span>
                      {formatear(cita.fecha, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, {cita.hora_inicio.slice(0, 5)}
                    </span>
                  </div>
                  <div className="finalizado-email">
                    <span>&#9993;</span>
                    <p>Te avisaremos por {cita.nombre_metodo_notificacion} con el comprobante e informacion sobre tu tramite</p>
                  </div>
                  <div className="finalizado-actions">
                    <IonButton
                      className="btn btn--white-outline"
                      onClick={() => mostrarAviso({ message: 'Comprobante descargado', duration: 2000, color: 'success' })}>
                      Descargar Comprobante
                    </IonButton>
                    <IonButton routerLink="/" className="btn btn--green">Volver al inicio</IonButton>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="finalizado-title">No hay una reserva reciente</h2>
                  <div className="finalizado-actions">
                    <IonButton routerLink="/" className="btn btn--green">Volver al inicio</IonButton>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}