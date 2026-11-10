import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, useIonToast, useIonViewWillEnter } from '@ionic/react';
import {
  checkmark, personOutline, documentOutline, folderOutline, calendarOutline, mailOutline, downloadOutline,
} from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { getUsuario } from '../services/authService';
import { leerTipo, leerReserva, limpiarReserva } from '../services/reserva';
import './TramiteFinalizado.css';

// Dia y hora de la cita que devolvio la API, escritos como 10/11/2026 09:00
function formatearFechaHora(cita) {
  if (!cita?.fecha) return '—';
  const [anio, mes, dia] = cita.fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio} ${cita.hora_inicio.slice(0, 5)}`;
}

// Los datos del resumen salen de la cita recien creada, no de lo que el usuario eligio en pantalla
function leerDatos() {
  const usuario = getUsuario();
  const { cita, id_tramite } = leerReserva();
  return {
    nombre: usuario?.nombre ?? '—',
    rut: usuario?.rut ?? '—',
    tramite: leerTipo()?.nombre_tipo_tramite ?? '—',
    fechaHora: formatearFechaHora(cita),
    idTramite: id_tramite,
    canal: cita?.nombre_metodo_notificacion,
  };
}

export default function TramiteFinalizado() {
  const [mostrarAviso] = useIonToast();
  const [datos, setDatos] = useState(leerDatos);

  // La pagina queda en memoria: se vuelven a leer los datos cada vez que se entra
  useIonViewWillEnter(() => setDatos(leerDatos()));

  const items = [
    { icono: personOutline, etiqueta: 'Nombre', valor: datos.nombre },
    { icono: documentOutline, etiqueta: 'RUT', valor: datos.rut },
    { icono: folderOutline, etiqueta: 'Tramite', valor: datos.tramite },
    { icono: calendarOutline, etiqueta: 'Fecha y hora', valor: datos.fechaHora },
  ];

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="finalizado-content">
            <div className="finalizado-card">
              <div className="finalizado-check"><IonIcon icon={checkmark} /></div>
              <h2 className="finalizado-title">Proceso completado</h2>
              <p className="finalizado-desc">Tu tramite quedo agendado correctamente</p>

              <div className="finalizado-datos">
                {items.map((it) => (
                  <div key={it.etiqueta} className="finalizado-dato">
                    <span className="finalizado-dato__icono"><IonIcon icon={it.icono} /></span>
                    <div>
                      <small>{it.etiqueta}</small>
                      <p>{it.valor}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="finalizado-email">
                <IonIcon icon={mailOutline} />
                <p>
                  {datos.idTramite ? `Tu tramite quedo registrado con el numero ${datos.idTramite}. ` : ''}
                  El aviso automatico{datos.canal ? ` por ${datos.canal.toLowerCase()}` : ''} todavia no esta disponible:
                  revisa el estado de tu tramite en Mis tramites
                </p>
              </div>

              <div className="finalizado-actions">
                <IonButton
                  className="btn btn--white-outline"
                  onClick={() => mostrarAviso({ message: 'La descarga del comprobante todavia no esta disponible', duration: 2500, color: 'warning' })}>
                  <IonIcon slot="start" icon={downloadOutline} /> Descargar Comprobante
                </IonButton>
                <IonButton routerLink="/" onClick={limpiarReserva} className="btn btn--green">Volver al inicio</IonButton>
              </div>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
