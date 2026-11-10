import { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonSpinner, IonText, useIonViewWillEnter } from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { listarTiposTramite } from '../services/catalogoService';
import { leerTipo, guardarReserva } from '../services/reserva';
import './TramiteLicencia.css';

// Texto corto de cada opcion: cuanto dura la cita y cuantos documentos pide ese tramite
function detalleDe(tipoTramite) {
  const cantidad = tipoTramite.documentos_requeridos.length;
  return `${tipoTramite.duracion_min} min · ${cantidad} ${cantidad === 1 ? 'documento' : 'documentos'}`;
}

export default function TramiteLicencia() {
  const [tipos, setTipos] = useState([]);
  const [idTipo, setIdTipo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Los tipos de tramite y los documentos que pide cada uno salen del catalogo de la API
  useEffect(() => {
    listarTiposTramite()
      .then((datos) => {
        setTipos(datos);
        const elegido = leerTipo()?.id_tipo_tramite;
        const hayElegido = datos.some((t) => t.id_tipo_tramite === elegido);
        setIdTipo(hayElegido ? elegido : datos[0]?.id_tipo_tramite ?? null);
      })
      .catch((e) => { setTipos([]); setError(e.mensaje); })
      .finally(() => setCargando(false));
  }, []);

  // Al volver a esta pagina se vuelve a marcar el tramite que ya estaba elegido
  useIonViewWillEnter(() => {
    const elegido = leerTipo()?.id_tipo_tramite;
    if (elegido) setIdTipo(elegido);
  });

  // Guarda el tipo completo (id, nombre y documentos) para los pasos siguientes de la reserva.
  // Empezar un tramite borra el avance del anterior, para no volver a usar su tramite ni su cita
  const continuar = () => guardarReserva({
    tipo: tipos.find((t) => t.id_tipo_tramite === idTipo),
    id_tramite: undefined,
    cita: undefined,
    documentos_registrados: undefined,
  });

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
                {!cargando && error && <IonText color="danger"><p>{error}</p></IonText>}
                {!cargando && !error && (
                  <IonSegment
                    className="tipo-tramite-options"
                    value={String(idTipo)}
                    onIonChange={(e) => setIdTipo(Number(e.detail.value))}>
                    {tipos.map((t) => (
                      <IonSegmentButton key={t.id_tipo_tramite} value={String(t.id_tipo_tramite)} className="tipo-btn">
                        <IonLabel>
                          <span className="tipo-btn__titulo">{t.nombre_tipo_tramite}</span>
                          <span className="tipo-btn__detalle">{detalleDe(t)}</span>
                        </IonLabel>
                      </IonSegmentButton>
                    ))}
                  </IonSegment>
                )}
              </div>
            </div>

            <IonButton
              routerLink="/calendario"
              disabled={!idTipo}
              onClick={continuar}
              className="btn btn--green tramite-continuar">
              Continuar <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
