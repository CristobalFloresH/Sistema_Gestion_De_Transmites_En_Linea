import { Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import NavBar from '../components/NavBar';
import './TramiteFinalizado.css';

export default function TramiteFinalizado() {
  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="finalizado-content">
            <div className="finalizado-card">
              <div className="finalizado-check">&#10003;</div>
              <h2 className="finalizado-title">Proceso completado</h2>
              <p className="finalizado-desc">
                Tu tramite [Nombre tramite] quedo agendado correctamente
              </p>
              <div className="finalizado-info">
                <span>Juan Lopez</span>
                <span>&middot;</span>
                <span>12.345.678-9</span>
                <span>&middot;</span>
                <span>Licencia</span>
                <span>&middot;</span>
                <span>17/09/2026 12 AM</span>
              </div>
              <div className="finalizado-email">
                <span>&#9993;</span>
                <p>Te enviamos un correo a juanlopez@gmail.com con el comprobante e informacion sobre [Tramite]</p>
              </div>
              <div className="finalizado-actions">
                <button className="btn btn--white-outline">Descargar Comprobante</button>
                <Link to="/" className="btn btn--green">Volver al inicio</Link>
              </div>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}