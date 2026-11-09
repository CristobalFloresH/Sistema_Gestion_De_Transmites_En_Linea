import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IonPage, IonContent, IonInput, IonInputPasswordToggle, IonButton, IonText,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { registrar, login } from '../services/authService';
import './Login.css';

export default function Registro() {
  const [form, setForm] = useState({ rut: '', nombre: '', correo: '', telefono: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const cambiar = (campo) => (e) => {
    setForm({ ...form, [campo]: e.detail.value ?? '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.rut.trim() || !form.nombre.trim() || !form.correo.trim() || !form.password) {
      setError('Completa RUT, nombre, correo y clave');
      return;
    }

    setCargando(true);
    try {
      await registrar({ ...form, rut: form.rut.trim() });
      await login(form.rut.trim(), form.password); // inicia sesion automaticamente
      navigate('/');
    } catch (err) {
      setError(err.message);
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
              <h2 className="login-card__title">Crear cuenta</h2>
              <p className="login-card__subtitle">Licencias de conducir</p>
              <form onSubmit={handleSubmit}>
                <IonInput label="RUT" labelPlacement="stacked" fill="outline" className="login-card__input"
                  placeholder="12.345.678-9" value={form.rut} onIonInput={cambiar('rut')} />
                <IonInput label="Nombre completo" labelPlacement="stacked" fill="outline" className="login-card__input"
                  value={form.nombre} onIonInput={cambiar('nombre')} />
                <IonInput label="Correo" labelPlacement="stacked" fill="outline" type="email" className="login-card__input"
                  value={form.correo} onIonInput={cambiar('correo')} />
                <IonInput label="Telefono (opcional)" labelPlacement="stacked" fill="outline" className="login-card__input"
                  placeholder="+56912345678" value={form.telefono} onIonInput={cambiar('telefono')} />
                <IonInput label="Clave (minimo 8 caracteres)" labelPlacement="stacked" fill="outline" type="password"
                  className="login-card__input" value={form.password} onIonInput={cambiar('password')}>
                  <IonInputPasswordToggle slot="end" />
                </IonInput>

                {error && (
                  <IonText color="danger">
                    <p style={{ textAlign: 'center' }}>{error}</p>
                  </IonText>
                )}

                <IonButton type="submit" expand="block" className="login-card__btn" disabled={cargando}>
                  {cargando ? 'Creando cuenta...' : 'Registrarme'}
                </IonButton>
              </form>
              <p className="login-card__footer">
                Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}