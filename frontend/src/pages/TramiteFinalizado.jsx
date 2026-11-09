import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, useIonToast, useIonViewWillEnter } from '@ionic/react';
import {
  checkmark, personOutline, documentOutline, folderOutline, calendarOutline, mailOutline, downloadOutline,
} from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { getUsuario } from '../services/authService';
import { buscarTipo, leerReserva, limpiarReserva } from '../services/reserva';
import './TramiteFinalizado.css';

function formatearFechaHora(reserva) {
  if (!reserva.fecha) return '—';
  const [anio, mes, dia] = reserva.fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}${reserva.hora ? ` ${reserva.hora}` : ''}`;
}

function leerDatos() {
  const usuario = getUsuario();
  const reserva = leerReserva();
  return {
    nombre: usuario?.nombre ?? '—',
    rut: usuario?.rut ?? '—',
    correo: usuario?.correo,
    tramite: buscarTipo(reserva.tipo)?.nombre ?? '—',
    fechaHora: formatearFechaHora(reserva),
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
                  Te enviamos un correo{datos.correo ? ` a ${datos.correo}` : ''} con el comprobante e informacion sobre tu tramite
                </p>
              </div>

              <div className="finalizado-actions">
                <IonButton
                  className="btn btn--white-outline"
                  onClick={() => mostrarAviso({ message: 'Comprobante descargado', duration: 2000, color: 'success' })}>
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
