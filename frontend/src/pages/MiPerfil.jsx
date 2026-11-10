import { useState } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner, useIonViewWillEnter } from '@ionic/react';
import { documentOutline, mailOutline, callOutline, personOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import ProgressBar from '../components/ProgressBar';
import { getUsuario } from '../services/authService';
import { obtenerUsuario } from '../services/usuarioService';
import { listarTramites } from '../services/tramiteService';
import { etapasDe, pasoActual, ID_LISTA_PARA_RETIRO, ID_RECHAZADO } from '../utils/etapas';
import './Cuenta.css';

// Un tramite sigue activo mientras no se haya retirado la licencia ni lo hayan rechazado
function estaActivo(tramite) {
  return tramite.id_estado_tramite !== ID_LISTA_PARA_RETIRO && tramite.id_estado_tramite !== ID_RECHAZADO;
}

function iniciales(nombre) {
  return nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}

export default function MiPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Los datos salen de la API, no del token: el token solo guarda el RUT, el nombre y el rol
  useIonViewWillEnter(() => {
    setCargando(true);
    setError('');
    const rut = getUsuario()?.rut;
    Promise.all([obtenerUsuario(rut), listarTramites()])
      .then(([datosUsuario, susTramites]) => {
        setUsuario(datosUsuario);
        setTramites(susTramites);
      })
      .catch((e) => { setUsuario(null); setError(e.mensaje); })
      .finally(() => setCargando(false));
  });

  const nombre = usuario?.nombre ?? 'Usuario';
  const datos = [
    { icono: documentOutline, etiqueta: 'RUT', valor: usuario?.rut },
    { icono: mailOutline, etiqueta: 'Correo', valor: usuario?.correo },
    { icono: callOutline, etiqueta: 'Telefono', valor: usuario?.telefono ?? 'No registrado' },
    { icono: personOutline, etiqueta: 'Tipo de cuenta', valor: usuario?.nombre_rol },
  ];
  const activos = tramites.filter(estaActivo);

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="cuenta-content">
            <h1 className="cuenta-title">Mi perfil</h1>
            <p className="cuenta-subtitle">Tus datos, tramites activos y licencias</p>

            {cargando && <IonSpinner name="crescent" />}
            {!cargando && error && <p className="cuenta-vacio">{error}</p>}

            {!cargando && usuario && (
              <>
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
                  {activos.length === 0 && <p className="cuenta-vacio">No tienes tramites activos</p>}
                  {activos.map((tramite) => (
                    <div key={tramite.id_tramite} className="perfil-tramite">
                      <div className="perfil-tramite__head">
                        <h3>{tramite.nombre_tipo_tramite}</h3>
                        <span className="pill pendiente">{tramite.nombre_estado_tramite}</span>
                      </div>
                      <ProgressBar
                        steps={etapasDe(tramite.id_tipo_tramite)}
                        currentStep={pasoActual(tramite.id_tipo_tramite, tramite.id_estado_tramite)}
                      />
                    </div>
                  ))}
                </section>

                <section className="cuenta-card">
                  <h2>Mis licencias</h2>
                  {/* El sistema todavia no registra las licencias emitidas; por ahora la seccion queda vacia */}
                  <p className="cuenta-vacio">Aun no tienes licencias registradas</p>
                </section>
              </>
            )}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
