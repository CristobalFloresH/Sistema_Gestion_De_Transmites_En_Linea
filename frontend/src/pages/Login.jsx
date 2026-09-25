import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import NavBar from '../components/NavBar';
import './Login.css';

export default function Login() {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/tramite-licencia');
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page login-page">
          <NavBar variant="public" />
          <div className="login-bg">
            <div className="login-card">
              <h2 className="login-card__title">Municipalidad de Santo Domingo</h2>
              <p className="login-card__subtitle">Licencias de conducir</p>
              <div className="login-card__icon">&#x1F697;</div>
              <h3 className="login-card__welcome">Bienvenido</h3>
              <p className="login-card__desc">
                Ingrese su RUT y clave unica para continuar
              </p>
              <form onSubmit={handleSubmit}>
                <label className="login-card__label">RUT</label>
                <input
                  type="text"
                  className="login-card__input"
                  placeholder="12.345.678-9"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                />
                <label className="login-card__label">Clave Unica</label>
                <input
                  type="password"
                  className="login-card__input"
                  placeholder="**********"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
                <button type="submit" className="login-card__btn">Ingresar</button>
              </form>
              <p className="login-card__footer">
                Problemas con tu clave unica?<br />
                <a href="https://claveunica.gob.cl" target="_blank" rel="noreferrer">
                  Ingresa aqui si necesitas ayuda
                </a>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}