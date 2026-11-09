import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { documentOutline, locationOutline, globeOutline, calendarOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { getUsuario } from '../services/authService';
import './Cuenta.css';

// Datos de ejemplo: mas adelante vendran del backend
const EJEMPLO = {
  direccion: 'Av. Libertad 123, Viña del Mar',
  pais: 'Chile',
  nacimiento: '05/03/1998',
};

const TRAMITES_ACTIVOS = [
  { tipo: 'Renovacion', estado: 'En Revisión', clase: 'pendiente', paso: 2 },
];

const LICENCIAS = [
  { clase: 'Clase B', emitida: '02/08/2022', vence: '02/08/2027', estado: 'Vigente', clase_css: 'aprobado' },
];

function iniciales(nombre) {
  return nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}

export default function MiPerfil() {
  const usuario = getUsuario();
  const nombre = usuario?.nombre ?? 'Usuario';
  const datos = [
    { icono: documentOutline, etiqueta: 'RUT', valor: usuario?.rut ?? '12.345.678-9' },
    { icono: calendarOutline, etiqueta: 'Fecha de nacimiento', valor: EJEMPLO.nacimiento },
    { icono: locationOutline, etiqueta: 'Direccion', valor: EJEMPLO.direccion },
    { icono: globeOutline, etiqueta: 'Pais', valor: EJEMPLO.pais },
  ];

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="cuenta-content">
            <h1 className="cuenta-title">Mi perfil</h1>
            <p className="cuenta-subtitle">Tus datos, tramites activos y licencias</p>

            <section className="cuenta-card">
              <div className="perfil-head">
                <div className="perfil-avatar">{iniciales(nombre)}</div>
                <h2 className="perfil-nombre">{nombre}</h2>
              </div>
              <div className="perfil-datos">
                {datos.map((d) => (
                  <div key={d.etiqueta} className="dato">
                    <span className="dato__icono"><IonIcon icon={d.icono} /></span>
                    <div><small>{d.etiqueta}</small><p>{d.valor}</p></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="cuenta-card">
              <h2>Tramites activos</h2>
              {TRAMITES_ACTIVOS.length === 0 && <p className="cuenta-vacio">No tienes tramites activos</p>}
              {TRAMITES_ACTIVOS.map((t) => (
                <div key={t.tipo} className="perfil-tramite">
                  <div className="perfil-tramite__head">
                    <h3>{t.tipo}</h3>
                    <span className={`pill ${t.clase}`}>{t.estado}</span>
                  </div>
                  <ProgressBar currentStep={t.paso} />
                </div>
              ))}
            </section>

            <section className="cuenta-card">
              <h2>Mis licencias</h2>
              {LICENCIAS.length === 0 && <p className="cuenta-vacio">Aun no tienes licencias registradas</p>}
              <div className="licencias">
                {LICENCIAS.map((l) => (
                  <div key={l.clase} className="licencia">
                    <div className="licencia__head">
                      <h3>{l.clase}</h3>
                      <span className={`pill ${l.clase_css}`}>{l.estado}</span>
                    </div>
                    <p>Emitida: {l.emitida}<br />Vence: {l.vence}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
