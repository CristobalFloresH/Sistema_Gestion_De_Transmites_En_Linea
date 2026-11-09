import { IonPage, IonContent } from '@ionic/react';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import './MisTramites.css';

// step = indice del paso actual (0 = Cita ... 5 = Recogida). null = sin progreso (ya cerrado)
const TRAMITES = [
  { tipo: 'Renovacion', estado: 'En Revisión', estadoClass: 'pendiente', step: 2 },
  { tipo: 'Licencia primera vez', estado: 'Aprobado', estadoClass: 'aprobado', step: null },
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
                <div key={i} className="tramite-card">
                  <div className="tramite-card__header">
                    <h2 className="tramite-card__titulo">{t.tipo}</h2>
                    <span className={`pill ${t.estadoClass}`}>{t.estado}</span>
                  </div>
                  {t.step !== null && (
                    <div className="tramite-card__contenido">
                      <ProgressBar currentStep={t.step} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
