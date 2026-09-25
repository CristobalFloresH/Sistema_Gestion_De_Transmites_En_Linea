import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react';
import { getUsuario } from '../services/authService';

export default function ProtectedRoute({ rol, children }) {
  const [usuario, setUsuario] = useState(getUsuario());

  // Ionic deja las paginas montadas: al volver a una (por ejemplo con la
  // flecha atras despues de cerrar sesion) se revisa de nuevo la sesion.
  useIonViewWillEnter(() => {
    setUsuario(getUsuario());
  });

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Solo las rutas de funcionario piden rol; un ciudadano vuelve al inicio.
  if (rol && usuario.rol !== rol) {
    return <Navigate to="/" replace />;
  }

  return children;
}
