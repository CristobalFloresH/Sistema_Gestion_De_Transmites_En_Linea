
import { useState } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import NavBar from '../components/NavBar';
import './Calendario.css';

const DIAS_MES = [
  [null, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, null, null, null, null],
];

const HORAS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];


export default function Calendario() {
  const [selectedDay, setSelectedDay] = useState(17);
  const [selectedHora, setSelectedHora] = useState(null);

  return (
    <IonPage>
      <IonContent>
        <div className="page calendario-page">
          <NavBar />
          <main className="tramite-content">
            <h1 className="tramite-content__title">
              Tu licencia de conducir, gestionada en linea en la municipalidad de Santo Domingo
            </h1>
            <p className="tramite-content__subtitle">
              Agenda tu hora, sube tus documentos y sigue tu tramite desde un solo lugar.
            </p>
            <div className="calendario-section">
              <div className="calendario-step-header">
                <div className="step-badge">2</div>
                <div className="step-header" style={{ flex: 1 }}>
                  <h3>Elija hora y dia</h3>
                  <span className="link-green">Busca mas horarios?</span>
                </div>
              </div>
              <div className="calendario-body">
                <div className="calendario-grid">
                  <div className="calendario-header">
                    <h3>Septiembre</h3>
                    <button className="calendario-nav">&gt;</button>
                  </div>
                  <table className="calendario-table">
                    <thead>
                      <tr><th>L</th><th>M</th><th>M</th><th>J</th><th>V</th><th>S</th><th>D</th></tr>
                    </thead>
                    <tbody>
                      {DIAS_MES.map((semana, i) => (
                        <tr key={i}>
                          {semana.map((dia, j) => (
                            <td key={j}
                              className={`cal-day ${dia === selectedDay ? 'selected' : ''} ${dia && dia < 15 ? 'past' : ''}`}
                              onClick={() => dia && setSelectedDay(dia)}>
                              {dia || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="calendario-legend">
                    <span className="legend-item"><span className="legend-dot available" /> Disponible</span>
                    <span className="legend-item"><span className="legend-dot occupied" /> Ocupado</span>
                  </div>
                </div>
                <div className="horas-panel">
                  <h4>Horas disponibles</h4>
                  <div className="horas-list">
                    {HORAS.map(h => (
                      <button key={h}
                        className={`hora-slot ${selectedHora === h ? 'selected' : ''}`}
                        onClick={() => setSelectedHora(h)}>
                        {h}
                      </button>
                    ))}
                  </div>
                  <IonButton routerLink="/tramite-finalizado" expand="block" className="btn btn--green">
                    Continuar
                  </IonButton>
                </div>
              </div>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
