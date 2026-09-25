import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonIcon, useIonToast } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import IconoPDF from '../assets/PDF.png';
import './AgendaProceso.css';

export default function AgendaProceso({ hasErrors = false }) {
  const [mostrarAviso] = useIonToast();

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="proceso-content">
            <div className="proceso-breadcrumb">
              <Link to="/funcionario/agenda" className="proceso-breadcrumb__link">Agenda</Link>
              <span> &gt; </span>
              <span>Proceso del tramite</span>
            </div>
            <div className="proceso-progress">
              <ProgressBar currentStep={1} />
            </div>
            <div className="proceso-panels">
              <div className="proceso-panel">
                <h3>Documentos adjuntados</h3>
                <div className="doc-list">
                  <div className="doc-item">
                    <span>Cedula_de_identidad.pdf</span>
                    <a href="#" className="link-action">ver</a>
                  </div>
                  <div className="doc-item">
                    <span>Certificado_de_ residencia.pdf</span>
                    <a href="#" className="link-action">ver</a>
                  </div>
                </div>
                <div className="doc-icons">
                  <div className="pdf-icon">
                    <img src={IconoPDF} alt="PDF" />
                    <small>105 KB</small>
                  </div>
                  <div className="pdf-icon">
                    <img src={IconoPDF} alt="PDF" />
                    <small>80 KB</small>
                  </div>
                </div>
              </div>
              <div className="proceso-panel">
                <h3>Validar veracidad de los documentos</h3>
                <ul className="validacion-list">
                  <li className={hasErrors ? 'error' : 'ok'}>
                    <IonIcon icon={hasErrors ? closeCircle : checkmarkCircle} /> Datos coinciden con RUT
                  </li>
                  <li className={hasErrors ? 'error' : 'ok'}>
                    <IonIcon icon={hasErrors ? closeCircle : checkmarkCircle} /> Documento legible
                  </li>
                  <li className="ok"><IonIcon icon={checkmarkCircle} /> Cumple normativa vigente</li>
                </ul>
                <div className="validacion-actions">
                  <IonButton
                    className="btn-validacion rechazar"
                    onClick={() => mostrarAviso({ message: 'Tramite rechazado', duration: 2000, color: 'danger' })}>
                    Rechazar
                  </IonButton>
                  <IonButton
                    className="btn-validacion aprobar"
                    onClick={() => mostrarAviso({ message: 'Tramite aprobado', duration: 2000, color: 'success' })}>
                    Aprobar
                  </IonButton>
                </div>
                <div className="historial">
                  <h4>Historial de tramites</h4>
                  <div className="historial-item">
                    <span>Renovacion 2026</span>
                    <span className="historial-estado proceso">En proceso</span>
                  </div>
                  <div className="historial-item">
                    <span>Licencia B nueva 2022</span>
                    <span className="historial-estado completado">Completado</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
