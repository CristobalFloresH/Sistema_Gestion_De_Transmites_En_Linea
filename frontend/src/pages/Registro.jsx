import { useState } from 'react';
import {
  IonPage, IonContent, IonInput, IonInputPasswordToggle, IonButton, IonText,
  IonSelect, IonSelectOption,
} from '@ionic/react';
import NavBar from '../components/NavBar';
import { registrar } from '../services/authService';
import './Login.css';

//Formato basico de correo: algo@dominio.terminacion (el mismo criterio que usa el backend)
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formularioVacio = { rut: '', nombre: '', correo: '', telefono: '', password: '', rol: 'ciudadano' };

//Registro de usuarios: pantalla solo para el administrador, crea ciudadanos o funcionarios sin cambiar la sesion actual
export default function Registro() {
  const [form, setForm] = useState(formularioVacio);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  //Actualiza un campo del formulario y limpia los mensajes anteriores
  const cambiar = (campo) => (e) => {
    setForm({ ...form, [campo]: e.detail.value ?? '' });
    setError('');
    setExito('');
  };

  //Valida los datos, envia el registro al backend con el token del administrador y deja el formulario listo para otro usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.rut.trim() || !form.nombre.trim() || !form.correo.trim() || !form.password) {
      setError('Completa RUT, nombre, correo y clave');
      return;
    }

    if (!formatoCorreo.test(form.correo.trim())) {
      setError('El correo no tiene un formato válido (ejemplo: nombre@correo.cl)');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await registrar({ ...form, rut: form.rut.trim(), correo: form.correo.trim() });
      setExito(`Usuario ${respuesta.datos.nombre} creado como ${form.rol}`);
      setForm(formularioVacio);
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
              <h2 className="login-card__title">Registro de ciudadanos</h2>
              <p className="login-card__subtitle">Solo administrador</p>
              <form onSubmit={handleSubmit}>
                <IonSelect label="Tipo de usuario" labelPlacement="stacked" fill="outline" className="login-card__input"
                  value={form.rol} onIonChange={cambiar('rol')}>
                  <IonSelectOption value="ciudadano">Ciudadano</IonSelectOption>
                  <IonSelectOption value="funcionario">Funcionario</IonSelectOption>
                </IonSelect>
                <IonInput label="RUT" labelPlacement="stacked" fill="outline" className="login-card__input"
                  placeholder="12.345.678-9" value={form.rut} onIonInput={cambiar('rut')} />
                <IonInput label="Nombre completo" labelPlacement="stacked" fill="outline" className="login-card__input"
                  value={form.nombre} onIonInput={cambiar('nombre')} />
                <IonInput label="Correo" labelPlacement="stacked" fill="outline" type="email" className="login-card__input"
                  value={form.correo} onIonInput={cambiar('correo')} />
                <IonInput label="Telefono (opcional)" labelPlacement="stacked" fill="outline" className="login-card__input"
                  placeholder="+56912345678" value={form.telefono} onIonInput={cambiar('telefono')} />
                <IonInput label="Clave inicial (minimo 8 caracteres)" labelPlacement="stacked" fill="outline" type="password"
                  className="login-card__input" value={form.password} onIonInput={cambiar('password')}>
                  <IonInputPasswordToggle slot="end" />
                </IonInput>

                {error && (
                  <IonText color="danger">
                    <p style={{ textAlign: 'center' }}>{error}</p>
                  </IonText>
                )}
                {exito && <p className="login-card__exito">{exito}</p>}

                <IonButton type="submit" expand="block" className="login-card__btn" disabled={cargando}>
                  {cargando ? 'Creando usuario...' : 'Crear usuario'}
                </IonButton>
              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
