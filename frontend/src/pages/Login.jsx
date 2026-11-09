import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IonPage, IonContent, IonInput, IonInputPasswordToggle, IonButton, IonText,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { login } from '../services/authService';
import { leerReserva } from '../services/reserva';
import './Login.css';

const PREGUNTAS = [
  { q: '¿Que tramites puedes realizar?', a: 'Licencia por primera vez, renovacion y reimpresion de tu licencia de conducir.' },
  { q: '¿Que documentos te piden?', a: 'Cedula de identidad, certificado de residencia y, para primera vez, certificado de educacion basica.' },
  { q: '¿Como sigo mi tramite?', a: 'Ingresa y entra a "Mis tramites" para ver en que fase va cada uno.' },
];

export default function Login() {
  const [abierta, setAbierta] = useState(null);
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
      rut: rut.trim() ? '' : 'Ingresa tu RUT',
      clave: clave.trim() ? '' : 'Ingresa tu clave unica',
    };
    setErrores(nuevosErrores);

    //Si falta algun datos se detiene el proceso 
    if (nuevosErrores.rut || nuevosErrores.clave) return;

    setCargando(true);
    try {
      //Conexion con Backend para hacer la peticion POST
      const usuario = await login(rut.trim(), clave);
      //Se revisa que rol es
      const esPersonal = usuario.rol === 'funcionario' || usuario.rol === 'administrador';
      //Dependiendo de que usuario sea lo manda a distintos apartados
      navigate(esPersonal ? '/funcionario/agenda' : (leerReserva().tipo ? '/calendario' : '/'));
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
          <div className="login-split">
            <section className="login-left">
              <div className="login-left__marca">
                <span className="login-left__linea" />
                <p>Municipalidad de Santo Domingo</p>
              </div>
              <h2 className="login-left__titulo">Gestiona tu licencia de conducir en linea</h2>
              <ul className="login-faq">
                {PREGUNTAS.map((p, i) => (
                  <li key={p.q} className={abierta === i ? 'abierta' : ''}>
                    <button type="button" className="login-faq__pregunta" onClick={() => setAbierta(abierta === i ? null : i)}>
                      <span className="login-faq__num">{i + 1}</span>
                      <span>{p.q}</span>
                      <span className="login-faq__flecha">⌄</span>
                    </button>
                    {abierta === i && <p className="login-faq__resp">{p.a}</p>}
                  </li>
                ))}
              </ul>
            </section>
            <section className="login-right">
              <div className="login-card">
                <h2 className="login-card__title">Ingresar</h2>
                <p className="login-card__subtitle">Con tu RUT y Clave Única</p>
                <form onSubmit={handleSubmit}>
                  <IonInput
                    label="RUT"
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
                    label="Clave Única"
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
                      <p style={{ textAlign: 'center', marginTop: 12 }}>{errorServidor}</p>
                    </IonText>
                  )}

                  <IonButton type="submit" expand="block" className="login-card__btn" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                  </IonButton>
                </form>
                <p className="login-card__footer">
                  <a href="https://claveunica.gob.cl" target="_blank" rel="noreferrer">¿Problemas con tu Clave Única?</a>
                </p>
                <p className="login-card__footer">
                  No tienes cuenta? <Link to="/registro">Registrate aqui</Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}