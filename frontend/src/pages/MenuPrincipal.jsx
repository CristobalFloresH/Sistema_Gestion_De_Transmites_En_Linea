
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonPage, IonContent, IonButton, IonCard, IonIcon, useIonToast
} from '@ionic/react';
import { arrowForward, idCardOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { listarTiposTramite } from '../services/catalogoService';
import { guardarReserva, limpiarReserva } from '../services/reserva';
import './MenuPrincipal.css';

const ACCESOS = [
  {
    tipo: 'primera_vez',
    titulo: 'Licencia Primera vez',
    detalle: 'Obtencion inicial de licencia Clase B o Clase C. Incluye examenes teorico, psicotecnico y medico',
  },
  {
    tipo: 'renovacion',
    titulo: 'Renovacion',
    detalle: 'Renovacion de documento vencido o pronto por vencer. Proceso con examenes psicotecnico y medico',
  },
  {
    tipo: 'reimprimir',
    titulo: 'Reimprimir',
    detalle: 'La reimpresion de la licencia se gestiona ante caso de perdida, robo o daño fisico al documento.',
  },
];

// Normaliza los nombres para comparar aunque tengan tildes
function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Busca el trámite correspondiente dentro del catálogo de la API
function buscarTipoTramite(tipos, clave) {
  return tipos.find((tipo) => {
    const nombre = normalizar(tipo.nombre_tipo_tramite);

    if (clave === 'primera_vez') {
      return nombre.includes('primera') ||
        (nombre.includes('obtencion') && nombre.includes('licencia'));
    }

    if (clave === 'renovacion') {
      return nombre.includes('renov');
    }

    if (clave === 'reimprimir') {
      return nombre.includes('reimpres') ||
        nombre.includes('duplic') ||
        nombre.includes('reposicion');
    }

    return false;
  });
}

export default function MenuPrincipal() {
  const navigate = useNavigate();
  const [mostrarAviso] = useIonToast();
  const [cargandoTipo, setCargandoTipo] = useState(false);

  const abrirCalendario = async (clave) => {
    if (cargandoTipo) return;

    setCargandoTipo(true);

    try {
      const tipos = await listarTiposTramite();
      const tipoSeleccionado = buscarTipoTramite(tipos, clave);

      if (!tipoSeleccionado) {
        mostrarAviso({
          message: 'No se encontró ese trámite en el catálogo. Revisa los tipos disponibles.',
          duration: 3500,
          color: 'warning',
        });
        return;
      }

      // Borra cualquier reserva anterior y guarda el trámite completo
      limpiarReserva();
      guardarReserva({ tipo: tipoSeleccionado });

      // Va directamente al calendario, sin pasar por la selección
      navigate('/calendario');

    } catch (e) {
      mostrarAviso({
        message: e.mensaje || 'No se pudieron cargar los trámites.',
        duration: 3500,
        color: 'danger',
      });
    } finally {
      setCargandoTipo(false);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page menu-principal">
          <NavBar />

          <main className="hero">
            <h1 className="hero__title">
              Tu licencia de conducir, gestionada en linea en la municipalidad de Santo Domingo
            </h1>

            <p className="hero__subtitle">
              Agenda tu hora, realiza tramites online y sigue cada fase de tu licencia desde un solo lugar
            </p>

            <div className="hero__actions">
              <IonButton routerLink="/tramite-licencia" className="btn btn--green">
                Ver Tramites <IonIcon slot="end" icon={arrowForward} />
              </IonButton>

              <IonButton routerLink="/mis-tramites" className="btn btn--outline">
                Seguir mis tramites
              </IonButton>
            </div>
          </main>

          <section className="accesos">
            <h2 className="accesos__title">Accesos Rapidos</h2>

            <div className="accesos__cards">
              {ACCESOS.map((a) => (
                <IonCard
                  key={a.tipo}
                  button
                  onClick={() => abrirCalendario(a.tipo)}
                  className="acceso-card"
                >
                  <div className="acceso-card__head">
                    <span className="acceso-card__icono">
                      <IonIcon icon={idCardOutline} />
                    </span>

                    <span className="acceso-card__titulo">
                      {a.titulo}
                    </span>
                  </div>

                  <p className="acceso-card__detalle">
                    {a.detalle}
                  </p>
                </IonCard>
              ))}
            </div>

            {cargandoTipo && (
              <p className="accesos__cargando">
                Cargando trámite...
              </p>
            )}
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
}
