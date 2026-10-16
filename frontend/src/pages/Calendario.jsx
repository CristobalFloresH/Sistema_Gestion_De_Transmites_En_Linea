import { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonDatetime, IonSpinner } from '@ionic/react';
import NavBar from '../components/NavBar';
import { listarBloquesPorFecha } from '../services/bloqueHorarioService';
import './Calendario.css';

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
  const [bloque, setBloque] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    listarBloquesPorFecha(fecha.slice(0, 10))
      .then((datos) => { if (vigente) setBloques(datos); })
      .catch((e) => { if (vigente) { setBloques([]); setError(e.mensaje); } })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [fecha]);

  const cambiarFecha = (nuevaFecha) => {
    setFecha(nuevaFecha);
    setBloque(null);
    setCargando(true);
    setError('');
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
                    {cargando && <IonSpinner name="crescent" />}
                    {!cargando && error && <p>{error}</p>}
                    {!cargando && !error && bloques.length === 0 && (
                      <p>No hay bloques disponibles para este día</p>
                    )}
                    {!cargando && bloques.map((b) => (
                      <IonButton
                        key={b.id_bloque_horario}
                        className={`hora-slot ${bloque?.id_bloque_horario === b.id_bloque_horario ? 'selected' : ''}`}
                        disabled={b.cupos_disponibles === 0}
                        onClick={() => setBloque(b)}>
                        <span className="hora-slot__contenido">
                          <span className="hora-slot__hora">{b.hora_inicio.slice(0, 5)}</span>
                          <span className="hora-slot__cupos">{b.cupos_disponibles} cupos</span>
                        </span>
                      </IonButton>
                    ))}
                  </div>
                  <p className="horas-panel__resumen">
                    {bloque && (
                      <>Seleccionaste: <strong>{formatearFecha(fecha)}, {bloque.hora_inicio.slice(0, 5)}</strong></>
                    )}
                  </p>
                  <IonButton
                    routerLink="/tramite-finalizado"
                    expand="block"
                    disabled={!bloque}
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

