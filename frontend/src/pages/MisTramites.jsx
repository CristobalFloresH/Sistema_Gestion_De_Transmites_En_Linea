import { IonPage, IonContent } from '@ionic/react';
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
                <div key={i} className="tramite-card">
                  <div className="tramite-card__header">
                    <div>
                      <h3>{t.tipo}</h3>
                      <p className="tramite-card__fecha">{t.fecha}</p>
                    </div>
                    <span className={`tramite-badge ${t.estadoClass}`}>{t.estado}</span>
                  </div>
                  {t.step !== null && (
                    <>
                      <ProgressBar currentStep={t.step} />
                      <div className="tramite-card__actions">
                        {t.actions.map((a, j) => (
                          <button key={j} className={`btn-tramite ${j === 0 ? 'cancel' : ''}`}>{a}</button>
                        ))}
                      </div>
                    </>
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
