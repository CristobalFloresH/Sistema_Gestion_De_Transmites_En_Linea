import { Navigate } from 'react-router-dom';
import { getUsuario } from '../services/authService';

export default function ProtectedRoute({ rol, children }) {
  const usuario = getUsuario();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rol && usuario.rol !== rol) {
    return <Navigate to={usuario.rol === 'funcionario' ? '/funcionario' : '/'} replace />;
  }

  return children;
}
