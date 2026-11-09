import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { notificationsOutline, calendarOutline, alertCircleOutline, timeOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import './Cuenta.css';

// Cambia a true para ver como se ve con notificaciones
const MOSTRAR_EJEMPLOS = false;

const EJEMPLOS = [
  { id: 1, icono: calendarOutline, texto: 'Tu cita del 17/09 a las 11:00 fue confirmada', fecha: 'Hace 2 horas', nueva: true },
  { id: 2, icono: alertCircleOutline, texto: 'Tu cedula de identidad fue rechazada: no es legible', fecha: 'Ayer', nueva: true },
  { id: 3, icono: timeOutline, texto: 'Tu licencia Clase B vence en 2 meses', fecha: '03/09/2026', nueva: false },
];

export default function Notificaciones() {
  const notificaciones = MOSTRAR_EJEMPLOS ? EJEMPLOS : [];

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="cuenta-content">
            <h1 className="cuenta-title">Notificaciones</h1>
            <p className="cuenta-subtitle">Avisos sobre tus tramites y documentos</p>

            <section className="cuenta-card">
              {notificaciones.length === 0 ? (
                <div className="notif-vacio">
                  <IonIcon icon={notificationsOutline} />
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                <ul className="notif-lista">
                  {notificaciones.map((n) => (
                    <li key={n.id} className={`notif-item ${n.nueva ? 'nueva' : ''}`}>
                      <span className="notif-item__icono"><IonIcon icon={n.icono} /></span>
                      <div><p>{n.texto}</p><small>{n.fecha}</small></div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
