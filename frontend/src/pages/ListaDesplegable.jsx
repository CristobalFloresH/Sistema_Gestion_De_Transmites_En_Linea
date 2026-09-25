import { Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import NavBar from '../components/NavBar';
import './MenuPrincipal.css';

export default function ListaDesplegable() {
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
                <Link to="/tramite-licencia" className="btn btn--green">Ver tramites</Link>
                <Link to="/mis-tramites" className="btn btn--outline">Seguir mis tramites</Link>
              </div>
            </div>
            <div className="hero__image">
              <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=520&h=345&fit=crop" alt="Licencia de conducir" />
            </div>
          </main>
          <section className="accesos">
            <h2 className="accesos__title">Accesos Rapidos</h2>
            <div className="accesos__cards">
              <Link to="/tramite-licencia" className="acceso-card"><span>Licencia Primera vez</span></Link>
              <Link to="/tramite-licencia" className="acceso-card"><span>Renovacion</span></Link>
              <Link to="/tramite-licencia" className="acceso-card"><span>Reimprimir</span></Link>
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
}
