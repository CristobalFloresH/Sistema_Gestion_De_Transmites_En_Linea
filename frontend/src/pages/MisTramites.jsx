import {
  IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonBadge,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import './MisTramites.css';

const TRAMITES = [
  {
    tipo: 'Renovacion',
    fecha: 'Cita: 05 sep 2026 11:00 AM',
    estado: 'en proceso',
    estadoClass: 'proceso',
    step: 1,
    actions: ['Cancelar cita', 'Reagendar', 'Ver detalles'],
  },
  {
    tipo: 'Renovacion',
    fecha: 'Rechazado: 03 ago 2026',
    estado: 'rechazado',
    estadoClass: 'rechazado',
    step: null,
    actions: [],
  },
  {
    tipo: 'Licencia Primera vez',
    fecha: 'Aprobado: 02 ago 2022',
    estado: 'aprobado',
    estadoClass: 'aprobado',
    step: null,
    actions: [],
  },
];

export default function MisTramites() {
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
              {TRAMITES.map((t, i) => (
                <IonCard key={i} className="tramite-card">
                  <IonCardHeader className="tramite-card__header">
                    <div>
                      <IonCardTitle className="tramite-card__titulo">{t.tipo}</IonCardTitle>
                      <IonCardSubtitle className="tramite-card__fecha">{t.fecha}</IonCardSubtitle>
                    </div>
                    <IonBadge className={`tramite-badge ${t.estadoClass}`}>{t.estado}</IonBadge>
                  </IonCardHeader>
                  {t.step !== null && (
                    <IonCardContent className="tramite-card__contenido">
                      <ProgressBar currentStep={t.step} />
                      <div className="tramite-card__actions">
                        {t.actions.map((a, j) => (
                          <IonButton key={j} className={`btn-tramite ${j === 0 ? 'cancel' : ''}`}>{a}</IonButton>
                        ))}
                      </div>
                    </IonCardContent>
                  )}
                </IonCard>
              ))}
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
