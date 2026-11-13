import { useState } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner, useIonViewWillEnter } from '@ionic/react';
import {
  notificationsOutline, calendarOutline, alertCircleOutline, timeOutline, checkmarkCircleOutline,
} from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { listarTramites, obtenerTramite } from '../services/tramiteService';
import { listarCitas } from '../services/citaService';
import { listarDocumentos } from '../services/documentoService';
import { ID_CITA_RESERVADA, ID_LISTA_PARA_RETIRO, ID_RECHAZADO } from '../utils/etapas';
import { ID_DOCUMENTO_APROBADO, ID_DOCUMENTO_RECHAZADO } from '../utils/documentos';
import { formatear } from '../utils/fechas';
import './Cuenta.css';

// Los avisos no se guardan en la base: se arman con lo que ya pasó en los tramites del ciudadano
// (su historial de estados, la revision de sus documentos y sus citas). Los envios de verdad van
// por correo o WhatsApp, segun el canal que eligio al agendar.

// "Hace 2 horas", "Ayer" o la fecha, igual que mostraba el diseño
function cuandoFue(momento) {
  const minutos = Math.round((Date.now() - new Date(momento)) / 60000);
  if (minutos < 60) return minutos <= 1 ? 'Recien' : `Hace ${minutos} minutos`;
  if (minutos < 24 * 60) return `Hace ${Math.round(minutos / 60)} horas`;
  if (minutos < 48 * 60) return 'Ayer';
  return formatear(new Date(momento).toISOString().slice(0, 10), { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Dia y hora de una cita en texto, por ejemplo "13/11 a las 09:00"
function textoCita(cita) {
  const [, mes, dia] = cita.fecha.slice(0, 10).split('-');
  return `${dia}/${mes} a las ${cita.hora_inicio.slice(0, 5)}`;
}

// Arma la lista de avisos de un tramite: los cambios de etapa y la revision de cada documento
function avisosDelTramite(tramite, documentos) {
  const avisos = [];

  for (const cambio of tramite.historial ?? []) {
    // El primer estado es el de la cita, que ya tiene su propio aviso
    if (cambio.id_estado_tramite === ID_CITA_RESERVADA) continue;
    const texto = cambio.id_estado_tramite === ID_LISTA_PARA_RETIRO
      ? `Tu licencia de ${tramite.nombre_tipo_tramite} esta lista para retiro`
      : cambio.id_estado_tramite === ID_RECHAZADO
        ? `Tu tramite de ${tramite.nombre_tipo_tramite} fue rechazado`
        : `Tu tramite de ${tramite.nombre_tipo_tramite} avanzo a: ${cambio.nombre_estado_tramite}`;
    avisos.push({
      id: `estado-${cambio.id_historial_estado}`,
      icono: cambio.id_estado_tramite === ID_RECHAZADO ? alertCircleOutline : timeOutline,
      momento: cambio.fecha,
      texto,
    });
  }

  for (const documento of documentos) {
    if (!documento.fecha_revision) continue;
    const rechazado = documento.id_estado_documento === ID_DOCUMENTO_RECHAZADO;
    if (!rechazado && documento.id_estado_documento !== ID_DOCUMENTO_APROBADO) continue;
    avisos.push({
      id: `documento-${documento.id_documento}`,
      icono: rechazado ? alertCircleOutline : checkmarkCircleOutline,
      momento: documento.fecha_revision,
      texto: rechazado
        ? `Tu ${documento.nombre_tipo_documento.toLowerCase()} fue rechazada: ${documento.motivo_rechazo}`
        : `Tu ${documento.nombre_tipo_documento.toLowerCase()} fue aprobada`,
    });
  }

  return avisos;
}

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Se vuelve a armar cada vez que se entra: la pagina queda montada en Ionic
  useIonViewWillEnter(() => {
    setCargando(true);
    setError('');
    Promise.all([listarTramites(), listarCitas()])
      .then(async ([tramites, citas]) => {
        const detalles = await Promise.all(tramites.map((tramite) => Promise.all([
          obtenerTramite(tramite.id_tramite),
          listarDocumentos(tramite.id_tramite),
        ])));

        const avisos = detalles.flatMap(([conHistorial, documentos]) => avisosDelTramite(conHistorial, documentos));
        for (const cita of citas) {
          avisos.push({
            id: `cita-${cita.id_cita}`,
            icono: calendarOutline,
            momento: cita.fecha_reserva,
            texto: cita.vigente
              ? `Tu cita del ${textoCita(cita)} quedo reservada (aviso por ${cita.nombre_metodo_notificacion.toLowerCase()})`
              : `Tu cita del ${textoCita(cita)} fue cancelada`,
          });
        }

        // Del mas nuevo al mas viejo, y los del ultimo dia se marcan como nuevos
        avisos.sort((uno, otro) => new Date(otro.momento) - new Date(uno.momento));
        const unDia = 24 * 60 * 60 * 1000;
        setNotificaciones(avisos.map((aviso) => ({
          ...aviso,
          fecha: cuandoFue(aviso.momento),
          nueva: Date.now() - new Date(aviso.momento) < unDia,
        })));
      })
      .catch((e) => { setNotificaciones([]); setError(e.mensaje); })
      .finally(() => setCargando(false));
  });

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="cuenta-content">
            <h1 className="cuenta-title">Notificaciones</h1>
            <p className="cuenta-subtitle">Avisos sobre tus tramites y documentos</p>

            <section className="cuenta-card">
              {cargando && <IonSpinner name="crescent" />}
              {!cargando && error && <p>{error}</p>}
              {!cargando && !error && notificaciones.length === 0 && (
                <div className="notif-vacio">
                  <IonIcon icon={notificationsOutline} />
                  <p>No hay notificaciones</p>
                </div>
              )}
              {!cargando && notificaciones.length > 0 && (
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
