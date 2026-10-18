
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonSegment, IonSegmentButton, IonLabel, IonSpinner } from '@ionic/react';
import NavBar from '../components/NavBar';
import { listarTiposTramite } from '../services/catalogoService';
import ImagenCalendario from '../assets/ImagenCalendario.png';
import './TramiteLicencia.css';

const DIAS = [12, 13, 14, 15, 16, 17, 18];

const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function TramiteLicencia() {
  const [tipos, setTipos] = useState([]);
  const [tipoTramite, setTipoTramite] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listarTiposTramite()
      .then((datos) => {
        setTipos(datos);
        if (datos.length > 0) setTipoTramite(String(datos[0].id_tipo_tramite));
      })
      .catch((e) => setError(e.mensaje))
      .finally(() => setCargando(false));
  }, []);

  const tipoSeleccionado = tipos.find((t) => String(t.id_tipo_tramite) === tipoTramite);
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
                {cargando && <IonSpinner name="crescent" />}
                {!cargando && error && <p>{error}</p>}
                {!cargando && !error && (
                  <IonSegment
                    className="tipo-tramite-options"
                    value={tipoTramite}
                    onIonChange={(e) => setTipoTramite(e.detail.value)}>
                    {tipos.map((t) => (
                      <IonSegmentButton key={t.id_tipo_tramite} value={String(t.id_tipo_tramite)} className="tipo-btn">
                        <IonLabel>
                          <span className="tipo-btn__titulo">{t.nombre_tipo_tramite}</span>
                          <span className="tipo-btn__detalle">
                            {t.duracion_min} min · {t.documentos_requeridos.length} documentos
                          </span>
                        </IonLabel>
                      </IonSegmentButton>
                    ))}
                  </IonSegment>
                )}
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
                  {tipoSeleccionado?.documentos_requeridos.map((doc) => (
                    <div key={doc.id_tipo_documento} className="doc-card">
                      {doc.nombre_tipo_documento}
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
