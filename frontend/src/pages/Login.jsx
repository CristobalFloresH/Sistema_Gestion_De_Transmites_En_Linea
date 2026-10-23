import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IonPage, IonContent, IonInput, IonInputPasswordToggle, IonButton, IonText,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { login } from '../services/authService';
import IconoAuto from '../assets/IconoAuto.png';
import './Login.css';

//Login de ciudadanos: simulador local de ClaveUnica (prototipo academico, valida contra la base de datos del proyecto)
export default function Login() {
  //Guarda la informacion del usuario
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');
  const [errores, setErrores] = useState({ rut: '', clave: '' });
  const [errorServidor, setErrorServidor] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  //Funcion enviar al presionar "ingresar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    //Se verifica que los campos no esten en blanco
    const nuevosErrores = {
      rut: rut.trim() ? '' : 'Ingresa tu RUN',
      clave: clave.trim() ? '' : 'Ingresa tu ClaveÚnica',
    };
    setErrores(nuevosErrores);

    //Si falta algun datos se detiene el proceso 
    if (nuevosErrores.rut || nuevosErrores.clave) return;

    setCargando(true);
    try {
      //Conexion con Backend para hacer la peticion POST
      //Se entra por el acceso ciudadano: si el RUT es de un funcionario el backend responde 403
      await login(rut.trim(), clave, 'ciudadano');
      navigate('/');
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
              <p className="login-card__subtitle">Licencias de conducir</p>
              <img src={IconoAuto} alt="Auto" className="login-card__icon" />
              <span className="login-card__etiqueta">PROTOTIPO ACADÉMICO</span>
              <h3 className="login-card__welcome">Ingresar con ClaveÚnica</h3>
              <p className="login-card__aviso">
                Esto es un simulador. No uses tu ClaveÚnica real.
              </p>
              <form onSubmit={handleSubmit}>
                <IonInput
                  label="RUN"
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
                  label="ClaveÚnica"
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

                <IonButton type="submit" expand="block" className="login-card__btn login-card__btn--claveunica" disabled={cargando}>
                  {cargando ? 'Ingresando...' : 'Ingresar con ClaveÚnica'}
                </IonButton>
              </form>

              <p className="login-card__footer">
                Eres funcionario municipal?<br />
                <Link to="/login-funcionario">Ingresa aqui con tu usuario y contraseña</Link>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}