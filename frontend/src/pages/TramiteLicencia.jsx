
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import NavBar from '../components/NavBar';
import ImagenCalendario from '../assets/ImagenCalendario.png';
import './TramiteLicencia.css';

const TIPOS_TRAMITE = [
  { value: 'primera_vez', titulo: 'Licencia (Primera Vez)', detalle: '30 min · 3 documentos' },
  { value: 'renovacion', titulo: 'Renovacion', detalle: '20 min · 2 documentos' },
  { value: 'reimprimir', titulo: 'Re-imprimir', detalle: '20 min · 2 documentos' },
];

const DIAS = [12, 13, 14, 15, 16, 17, 18];

const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const DOCUMENTOS = [
  { nombre: 'Certificado de residencia', cargado: false },
  { nombre: 'Certificado de educacion basica', cargado: false },
  { nombre: 'Cedula de Identidad', cargado: true },
];

export default function TramiteLicencia() {
  const [tipoTramite, setTipoTramite] = useState('primera_vez');
  const [dia, setDia] = useState(16);
  const [hora, setHora] = useState(null);


  return (
    <IonPage>
      <IonContent>
        <div className="page tramite-page">
          <NavBar />
          <main className="tramite-content">
            <h1 className="tramite-content__title">
              Tu licencia de conducir, gestionada en linea en la municipalidad de Santo Domingo
            </h1>
            <p className="tramite-content__subtitle">
              Agenda tu hora, sube tus documentos y sigue tu tramite desde un solo lugar.
            </p>

            <div className="tramite-step">
              <div className="step-badge">1</div>
              <div className="step-content">
                <h3>Seleccione el tipo de tramite a realizar</h3>
                <IonSegment
                  className="tipo-tramite-options"
                  value={tipoTramite}
                  onIonChange={(e) => setTipoTramite(e.detail.value)}>
                  {TIPOS_TRAMITE.map((t) => (
                    <IonSegmentButton key={t.value} value={t.value} className="tipo-btn">
                      <IonLabel>
                        <span className="tipo-btn__titulo">{t.titulo}</span>
                        <span className="tipo-btn__detalle">{t.detalle}</span>
                      </IonLabel>
                    </IonSegmentButton>
                  ))}
                </IonSegment>
              </div>
            </div>

            <div className="tramite-step">
              <div className="step-badge">2</div>
              <div className="step-content">
                <h3>Elija hora y dia</h3>
                <div className="fecha-selector">
                  <div className="fecha-box">
                    <p className="fecha-box__titulo">Septiembre 2026</p>
                    <div className="dias-fila">
                      {DIAS.map((d) => (
                        <IonButton
                          key={d}
                          className={`opcion-btn ${dia === d ? 'selected' : ''}`}
                          onClick={() => setDia(d)}>
                          {d}
                        </IonButton>
                      ))}
                    </div>
                  </div>
                  <div className="fecha-box">
                    <p className="fecha-box__titulo">Bloques {dia} de Septiembre</p>
                    <div className="horas-grid">
                      {HORAS.map((h) => (
                        <IonButton
                          key={h}
                          className={`opcion-btn opcion-btn--hora ${hora === h ? 'selected' : ''}`}
                          onClick={() => setHora(h)}>
                          {h}
                        </IonButton>
                      ))}
                    </div>
                  </div>
                  <Link to="/calendario" className="mas-horarios">
                    <strong>¿Buscas mas horarios?</strong>
                    <img src={ImagenCalendario} alt="Calendario" className="mas-horarios__icono" />
                    <small>Click aqui</small>
                  </Link>
                </div>
              </div>
            </div>

            <div className="tramite-step">
              <div className="step-badge">3</div>
              <div className="step-content">
                <h3>Carga tus documentos (PDF)</h3>
                <div className="docs-grid">
                  {DOCUMENTOS.map((doc) => (
                    <div key={doc.nombre} className={`doc-card ${doc.cargado ? 'cargado' : ''}`}>
                      {doc.nombre}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <IonButton routerLink="/tramite-finalizado" className="btn btn--green tramite-continuar">
              Continuar
            </IonButton>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
