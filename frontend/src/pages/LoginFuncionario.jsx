import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IonPage, IonContent, IonInput, IonInputPasswordToggle, IonButton, IonText,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { login } from '../services/authService';
import IconoAuto from '../assets/IconoAuto.png';
import './Login.css';

//Login del personal municipal (funcionarios y administradores) con usuario (RUT) y contraseña
export default function LoginFuncionario() {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');
  const [errores, setErrores] = useState({ rut: '', clave: '' });
  const [errorServidor, setErrorServidor] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  //Valida los campos, inicia sesion por el acceso funcionario y lleva a la agenda
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const nuevosErrores = {
      rut: rut.trim() ? '' : 'Ingresa tu usuario (RUT)',
      clave: clave.trim() ? '' : 'Ingresa tu contraseña',
    };
    setErrores(nuevosErrores);
    if (nuevosErrores.rut || nuevosErrores.clave) return;

    setCargando(true);
    try {
      //Si el RUT es de un ciudadano el backend responde 403 y se muestra el mensaje
      await login(rut.trim(), clave, 'funcionario');
      navigate('/funcionario/agenda');
    } catch (error) {
      setErrorServidor(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page login-page">
          <NavBar />
          <div className="login-bg">
            <div className="login-card">
              <h2 className="login-card__title">Municipalidad de Santo Domingo</h2>
              <p className="login-card__subtitle">Acceso funcionarios</p>
              <img src={IconoAuto} alt="Auto" className="login-card__icon" />
              <h3 className="login-card__welcome">Personal municipal</h3>
              <p className="login-card__desc">
                Ingrese su usuario y contraseña para continuar
              </p>
              <form onSubmit={handleSubmit}>
                <IonInput
                  label="Usuario (RUT)"
                  labelPlacement="stacked"
                  fill="outline"
                  className={`login-card__input ${errores.rut ? 'ion-invalid ion-touched' : ''}`}
                  placeholder="12.345.678-9"
                  errorText={errores.rut}
                  value={rut}
                  onIonInput={(e) => {
                    setRut(e.detail.value ?? '');
                    setErrores({ ...errores, rut: '' });
                  }}
                />
                <IonInput
                  label="Contraseña"
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

                {errorServidor && (
                  <IonText color="danger">
                    <p style={{ textAlign: 'center' }}>{errorServidor}</p>
                  </IonText>
                )}

                <IonButton type="submit" expand="block" className="login-card__btn" disabled={cargando}>
                  {cargando ? 'Ingresando...' : 'Ingresar'}
                </IonButton>
              </form>

              <p className="login-card__footer">
                Eres ciudadano?<br />
                <Link to="/login">Ingresa con el simulador de ClaveUnica</Link>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
