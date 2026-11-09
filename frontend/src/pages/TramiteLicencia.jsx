import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonSegment, IonSegmentButton, IonLabel, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { TIPOS_TRAMITE, leerReserva, guardarReserva } from '../services/reserva';
import './TramiteLicencia.css';

export default function TramiteLicencia() {
  const [tipoTramite, setTipoTramite] = useState(leerReserva().tipo ?? 'primera_vez');
  useIonViewWillEnter(() => setTipoTramite(leerReserva().tipo ?? 'primera_vez'));

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
                <IonSegment
                  className="tipo-tramite-options"
                  value={tipoTramite}
                  onIonChange={(e) => setTipoTramite(e.detail.value)}>
                  {TIPOS_TRAMITE.map((t) => (
                    <IonSegmentButton key={t.value} value={t.value} className="tipo-btn">
                      <IonLabel>
                        <span className="tipo-btn__titulo">{t.titulo}</span>
                        <span className="tipo-btn__detalle">{t.detalle}</span>
                      </IonLabel>
                    </IonSegmentButton>
                  ))}
                </IonSegment>
              </div>
            </div>

            <IonButton
              routerLink="/calendario"
              onClick={() => guardarReserva({ tipo: tipoTramite })}
              className="btn btn--green tramite-continuar">
              Continuar <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
