import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonIcon, IonTextarea, useIonToast } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import IconoPDF from '../assets/PDF.png';
import './AgendaProceso.css';

function Check({ ok, children }) {
  return (
    <li className={ok ? 'ok' : 'error'}>
      <IonIcon icon={ok ? checkmarkCircle : closeCircle} /> {children}
    </li>
  );
}

export default function AgendaProceso({ hasErrors = false }) {
  const [mostrarAviso] = useIonToast();
  const [motivo, setMotivo] = useState('');

  const rechazar = () => {
    if (!motivo.trim()) {
      mostrarAviso({ message: 'Escribe el motivo del rechazo', duration: 2000, color: 'warning' });
      return;
    }
    mostrarAviso({ message: 'Tramite rechazado', duration: 2000, color: 'danger' });
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="proceso-content">
            <div className="proceso-breadcrumb">
              <Link to="/funcionario/agenda" className="proceso-breadcrumb__link">Agenda</Link>
              <span className="proceso-breadcrumb__sep"> &gt; </span>
              <span className="proceso-breadcrumb__actual">Proceso del tramite</span>
            </div>

            <div className="proceso-resumen">
              <div className="proceso-resumen__head">
                <h2>Renovacion</h2>
                <span className="pill pendiente">En Revisión</span>
              </div>
              <ProgressBar currentStep={2} />
            </div>

            <div className="proceso-panels">
              <div className={`proceso-panel ${hasErrors ? 'con-error' : ''}`}>
                <h3>Documentos adjuntados</h3>
                <div className="doc-list">
                  <div className="doc-item">
                    <img src={IconoPDF} alt="PDF" />
                    <div className="doc-item__info">
                      <strong>Cedula_de_identidad.pdf</strong>
                      <small>96 KB</small>
                    </div>
                    {hasErrors && <span className="doc-item__badge">No legible</span>}
                    <a href="#" className="doc-item__ver" onClick={(e) => e.preventDefault()}>Ver</a>
                  </div>
                  <div className="doc-item">
                    <img src={IconoPDF} alt="PDF" />
                    <div className="doc-item__info">
                      <strong>Certificado_de_residencia.pdf</strong>
                      <small>412 KB</small>
                    </div>
                    <a href="#" className="doc-item__ver" onClick={(e) => e.preventDefault()}>Ver</a>
                  </div>
                </div>
              </div>

              <div className={`proceso-panel ${hasErrors ? 'con-error' : ''}`}>
                <h3>Validar veracidad de los documentos</h3>
                <ul className="validacion-list">
                  <Check ok={!hasErrors}>Datos coinciden con el RUT</Check>
                  <Check ok={!hasErrors}>Documento legible</Check>
                  <Check ok>Cumple normativa vigente</Check>
                </ul>
                <p className="motivo-label">Motivo del rechazo</p>
                <IonTextarea
                  className="motivo-input"
                  placeholder="Explicar que debe corregir el ciudadano"
                  rows={3}
                  value={motivo}
                  onIonInput={(e) => setMotivo(e.detail.value ?? '')}
                />
                <div className="validacion-actions">
                  <IonButton className="btn-validacion rechazar" onClick={rechazar}>Rechazar</IonButton>
                  <IonButton
                    className="btn-validacion aprobar"
                    onClick={() => mostrarAviso({ message: 'Tramite aprobado', duration: 2000, color: 'success' })}>
                    Aceptar
                  </IonButton>
                </div>
                <div className="historial">
                  <h4>Historial de tramites</h4>
                  <div className="historial-item">
                    <span>Renovacion 2026</span>
                    <span className="pill proceso">En proceso</span>
                  </div>
                  <div className="historial-item">
                    <span>Licencia nueva B 2022</span>
                    <span className="pill aprobado">Aprobado</span>
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
