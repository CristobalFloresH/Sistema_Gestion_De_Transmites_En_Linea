import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonDatetime } from '@ionic/react';
import NavBar from '../components/NavBar';
import './Calendario.css';

const BLOQUES = [
  { hora: '09:00', cupos: 13 },
  { hora: '10:00', cupos: 30 },
  { hora: '11:00', cupos: 1 },
  { hora: '12:00', cupos: 3 },
  { hora: '13:00', cupos: 3 },
];

function fechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function formatearFecha(fechaIso) {
  const fecha = new Date(`${fechaIso.slice(0, 10)}T12:00:00`);
  const texto = fecha.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function Calendario() {
  const hoy = fechaDeHoy();
  const [fecha, setFecha] = useState(hoy);
  const [hora, setHora] = useState(null);

  const cambiarFecha = (nuevaFecha) => {
    setFecha(nuevaFecha);
    setHora(null);
  };

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
              <div className="calendario-body">
                <div>
                  <div className="calendario-step-header">
                    <div className="step-badge">2</div>
                    <h3>Elija hora y dia</h3>
                  </div>
                  <div className="calendario-grid">
                    <IonDatetime
                      className="calendario-datetime"
                      presentation="date"
                      locale="es-CL"
                      firstDayOfWeek={1}
                      min={hoy}
                      value={fecha}
                      onIonChange={(e) => cambiarFecha(e.detail.value)}
                    />
                  </div>
                </div>
                <div className="horas-panel">
                  <h4>Bloques disponibles</h4>
                  <p className="horas-panel__fecha">{formatearFecha(fecha)}</p>
                  <div className="horas-list">
                    {BLOQUES.map((b) => (
                      <IonButton
                        key={b.hora}
                        className={`hora-slot ${hora === b.hora ? 'selected' : ''}`}
                        onClick={() => setHora(b.hora)}>
                        <span className="hora-slot__contenido">
                          <span className="hora-slot__hora">{b.hora}</span>
                          <span className="hora-slot__cupos">{b.cupos} cupos</span>
                        </span>
                      </IonButton>
                    ))}
                  </div>
                  <p className="horas-panel__resumen">
                    {hora && (
                      <>Seleccionaste: <strong>{formatearFecha(fecha)}, {hora}</strong></>
                    )}
                  </p>
                  <IonButton
                    routerLink="/tramite-finalizado"
                    expand="block"
                    disabled={!hora}
                    className="btn btn--green calendario-continuar">
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
