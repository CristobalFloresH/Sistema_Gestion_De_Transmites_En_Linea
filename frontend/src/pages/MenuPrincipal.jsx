import { IonPage, IonContent, IonButton, IonCard, IonIcon } from '@ionic/react';
import { arrowForward, idCardOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { guardarReserva } from '../services/reserva';
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

export default function MenuPrincipal() {
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
              <IonButton routerLink="/mis-tramites" className="btn btn--outline">Seguir mis tramites</IonButton>
            </div>
          </main>
          <section className="accesos">
            <h2 className="accesos__title">Accesos Rapidos</h2>
            <div className="accesos__cards">
              {ACCESOS.map((a) => (
                <IonCard
                  key={a.titulo}
                  button
                  routerLink="/calendario"
                  onClick={() => guardarReserva({ tipo: a.tipo })}
                  className="acceso-card">
                  <div className="acceso-card__head">
                    <span className="acceso-card__icono"><IonIcon icon={idCardOutline} /></span>
                    <span className="acceso-card__titulo">{a.titulo}</span>
                  </div>
                  <p className="acceso-card__detalle">{a.detalle}</p>
                </IonCard>
              ))}
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
}
