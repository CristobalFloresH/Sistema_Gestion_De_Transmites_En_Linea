import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react';
//Funcion para leer si hay un usuario
import { getUsuario } from '../services/authService';

//Se verifica que el rol pueda entrar a la pagina
export default function ProtectedRoute({ rol, children }) {
  //Estado que guarda la informacion del usuario
  const [usuario, setUsuario] = useState(getUsuario());

  //Actualizacion dinamica
  useIonViewWillEnter(() => {
    setUsuario(getUsuario());
  });

  //Filtro de autenticacion
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  //Filtro de autorizacion, verifica si el rol es el correcto para entrar segun la ruta
  if (rol) {
    const rolesPermitidos = rol === 'funcionario' ? ['funcionario', 'administrador'] : [rol];
    if (!rolesPermitidos.includes(usuario.rol)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}