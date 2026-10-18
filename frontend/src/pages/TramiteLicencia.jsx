
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonSegment, IonSegmentButton, IonLabel, IonSpinner } from '@ionic/react';
import NavBar from '../components/NavBar';
import { listarTiposTramite, listarMetodosNotificacion } from '../services/catalogoService';
import { listarBloquesPorFecha } from '../services/bloqueHorarioService';
import ImagenCalendario from '../assets/ImagenCalendario.png';
import './TramiteLicencia.css';

// Las 7 fechas desde hoy, en formato AAAA-MM-DD (el que pide el backend)
function proximosSieteDias() {
  return Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  });
}

// Formatea una fecha AAAA-MM-DD, por ejemplo "octubre de 2026" o "19 de octubre"
function formatear(fechaIso, opciones) {
  return new Date(`${fechaIso}T12:00:00`).toLocaleDateString('es-CL', opciones);
}

export default function TramiteLicencia() {
  const [tipos, setTipos] = useState([]);
  const [tipoTramite, setTipoTramite] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [metodos, setMetodos] = useState([]);
  const [metodo, setMetodo] = useState('');

  useEffect(() => {
    Promise.all([listarTiposTramite(), listarMetodosNotificacion()])
      .then(([datosTipos, datosMetodos]) => {
        setTipos(datosTipos);
        if (datosTipos.length > 0) setTipoTramite(String(datosTipos[0].id_tipo_tramite));
        setMetodos(datosMetodos);
        if (datosMetodos.length > 0) setMetodo(String(datosMetodos[0].id_metodo_notificacion));
      })
      .catch((e) => setError(e.mensaje))
      .finally(() => setCargando(false));
  }, []);

  const tipoSeleccionado = tipos.find((t) => String(t.id_tipo_tramite) === tipoTramite);
  const [dias] = useState(proximosSieteDias);
  const [dia, setDia] = useState(dias[0]);
  const [bloque, setBloque] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [cargandoBloques, setCargandoBloques] = useState(true);
  const [errorBloques, setErrorBloques] = useState('');

  useEffect(() => {
    let vigente = true;
    listarBloquesPorFecha(dia)
      .then((datos) => { if (vigente) setBloques(datos); })
      .catch((e) => { if (vigente) { setBloques([]); setErrorBloques(e.mensaje); } })
      .finally(() => { if (vigente) setCargandoBloques(false); });
    return () => { vigente = false; };
  }, [dia]);

  const cambiarDia = (nuevoDia) => {
    setDia(nuevoDia);
    setBloque(null);
    setCargandoBloques(true);
    setErrorBloques('');
  };


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
                    <p className="fecha-box__titulo">
                      {formatear(dia, { month: 'long', year: 'numeric' })}
                    </p>
                    <div className="dias-fila">
                      {dias.map((d) => (
                        <IonButton
                          key={d}
                          className={`opcion-btn ${dia === d ? 'selected' : ''}`}
                          onClick={() => cambiarDia(d)}>
                          {Number(d.slice(8, 10))}
                        </IonButton>
                      ))}
                    </div>
                  </div>
                  <div className="fecha-box">
                    <p className="fecha-box__titulo">
                      Bloques {formatear(dia, { day: 'numeric', month: 'long' })}
                    </p>
                    <div className="horas-grid">
                      {cargandoBloques && <IonSpinner name="crescent" />}
                      {!cargandoBloques && errorBloques && <p>{errorBloques}</p>}
                      {!cargandoBloques && !errorBloques && bloques.length === 0 && (
                        <p>No hay horas disponibles este día</p>
                      )}
                      {!cargandoBloques && bloques.map((b) => (
                        <IonButton
                          key={b.id_bloque_horario}
                          className={`opcion-btn opcion-btn--hora ${bloque?.id_bloque_horario === b.id_bloque_horario ? 'selected' : ''}`}
                          disabled={b.cupos_disponibles === 0}
                          onClick={() => setBloque(b)}>
                          {b.hora_inicio.slice(0, 5)}
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

            <div className="tramite-step">
              <div className="step-badge">4</div>
              <div className="step-content">
                <h3>¿Cómo quieres que te avisemos?</h3>
                {!cargando && !error && (
                  <IonSegment
                    className="tipo-tramite-options"
                    value={metodo}
                    onIonChange={(e) => setMetodo(e.detail.value)}>
                    {metodos.map((m) => (
                      <IonSegmentButton key={m.id_metodo_notificacion} value={String(m.id_metodo_notificacion)} className="tipo-btn">
                        <IonLabel>
                          <span className="tipo-btn__titulo">{m.nombre_metodo_notificacion}</span>
                        </IonLabel>
                      </IonSegmentButton>
                    ))}
                  </IonSegment>
                )}
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
