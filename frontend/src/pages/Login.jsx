import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonPage, IonContent, IonInput, IonInputPasswordToggle, IonButton,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { login } from '../services/authService';
import IconoAuto from '../assets/IconoAuto.png';
import './Login.css';

export default function Login() {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');
  const [errores, setErrores] = useState({ rut: '', clave: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = {
      rut: rut.trim() ? '' : 'Ingresa tu RUT',
      clave: clave.trim() ? '' : 'Ingresa tu clave unica',
    };
    setErrores(nuevosErrores);
    if (nuevosErrores.rut || nuevosErrores.clave) return;

    login('ciudadano');
    navigate('/');
  };

  const entrarComoFuncionario = () => {
    login('funcionario');
    navigate('/');
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page login-page">
          <NavBar />
          <div className="login-bg">
            <div className="login-card">
              <h2 className="login-card__title">Municipalidad de Santo Domingo</h2>
              <p className="login-card__subtitle">Licencias de conducir</p>
              <img src={IconoAuto} alt="Auto" className="login-card__icon" />
              <h3 className="login-card__welcome">Bienvenido</h3>
              <p className="login-card__desc">
                Ingrese su RUT y clave unica para continuar
              </p>
              <form onSubmit={handleSubmit}>
                <IonInput
                  label="RUT"
                  labelPlacement="stacked"
                  fill="outline"
                  className={`login-card__input ${errores.rut ? 'ion-invalid ion-touched' : ''}`}
                  placeholder="12.345.678-9"
                  helperText="Formato: 12.345.678-9"
                  errorText={errores.rut}
                  value={rut}
                  onIonInput={(e) => {
                    setRut(e.detail.value ?? '');
                    setErrores({ ...errores, rut: '' });
                  }}
                />
                <IonInput
                  label="Clave Unica"
                  labelPlacement="stacked"
                  fill="outline"
                  type="password"
                  className={`login-card__input ${errores.clave ? 'ion-invalid ion-touched' : ''}`}
                  placeholder="**********"
                  errorText={errores.clave}
                  value={clave}
                  onIonInput={(e) => {
                    setClave(e.detail.value ?? '');
                    setErrores({ ...errores, clave: '' });
                  }}
                >
                  <IonInputPasswordToggle slot="end" />
                </IonInput>
                <IonButton type="submit" expand="block" className="login-card__btn">
                  Ingresar
                </IonButton>
              </form>
              <IonButton fill="clear" size="small" className="login-card__func" onClick={entrarComoFuncionario}>
                Ingreso funcionarios
              </IonButton>

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
