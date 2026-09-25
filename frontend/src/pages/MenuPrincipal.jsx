import { IonPage, IonContent, IonButton, IonCard } from '@ionic/react';
import ImagenPersonas from '../assets/ImagenPersonasMenuPrincipal.webp';
import NavBar from '../components/NavBar';
import './MenuPrincipal.css';

export default function MenuPrincipal() {
  return (
    <IonPage>
      <IonContent>
        <div className="page menu-principal">
          <NavBar />
          <main className="hero">
            <div className="hero__content">
              <h1 className="hero__title">
                Tu licencia de conducir, gestionada en linea en la municipalidad de Santo Domingo
              </h1>
              <p className="hero__subtitle">
                Agenda tu hora, realiza tramites online y sigue cada fase de tu licencia desde un solo lugar
              </p>
              <div className="hero__actions">
                <IonButton routerLink="/tramite-licencia" className="btn btn--green">Ver Tramites</IonButton>
                <IonButton routerLink="/mis-tramites" className="btn btn--outline">Seguir mis tramites</IonButton>
              </div>
            </div>
            <div className="hero__image">
              <img src={ImagenPersonas} alt="Personas realizando tramites" />
            </div>
          </main>
          <section className="accesos">
            <h2 className="accesos__title">Accesos Rapidos</h2>
            <div className="accesos__cards">
              <IonCard button routerLink="/tramite-licencia" className="acceso-card">
                <span>Licencia Primera vez</span>
              </IonCard>
              <IonCard button routerLink="/tramite-licencia" className="acceso-card">
                <span>Renovacion</span>
              </IonCard>
              <IonCard button routerLink="/tramite-licencia" className="acceso-card">
                <span>Reimprimir</span>
              </IonCard>
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
}
