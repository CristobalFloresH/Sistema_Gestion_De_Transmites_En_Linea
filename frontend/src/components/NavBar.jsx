import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react';
import { getUsuario, logout } from '../services/authService';
import './NavBar.css';

export default function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [usuario, setUsuario] = useState(getUsuario());

  // Ionic deja las paginas montadas: cada vez que se vuelve a una,
  // se revisa de nuevo si hay sesion.
  useIonViewWillEnter(() => {
    setUsuario(getUsuario());
    setShowDropdown(false);
  });

  let variant = 'public';
  if (usuario?.rol === 'ciudadano') variant = 'logged';
  if (usuario?.rol === 'funcionario') variant = 'funcionario';

  return (
    <nav className="NavBar">
      <div className="NavBar__logo">
        <Link to="/">Municipalidad de Santo Domingo</Link>
      </div>
      <div className="NavBar__links">
        {variant === 'funcionario' && (
          <Link to="/funcionario/agenda" className="NavBar__link">Agenda</Link>
        )}
        <Link to="/tramite-licencia" className="NavBar__link">Tramites</Link>
        <Link to="/" className="NavBar__link">Contacto</Link>
        {variant === 'public' && (
          <Link to="/login" className="NavBar__btn-ingresar">Ingresar</Link>
        )}
        {variant !== 'public' && (
          <div className="NavBar__user-area">
            <button
              className={variant === 'funcionario' ? 'NavBar__btn-user NavBar__btn-func' : 'NavBar__btn-user'}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {/* Cuando exista el login real, se mostrara el nombre del usuario */}
              Hola {usuario.nombre || (variant === 'funcionario' ? 'Func.XXXX' : 'XXXX')}
            </button>
            {showDropdown && (
              <div className="NavBar__dropdown">
                <div className="NavBar__dropdown-header">
                  <div className="NavBar__avatar" />
                  <div>
                    <strong>{usuario.nombre || 'Usuario'}</strong>
                    <p>{variant === 'funcionario' ? 'Funcionario' : 'Ciudadano'}</p>
                  </div>
                </div>
                <ul>
                  <li><Link to="/">Mi perfil</Link></li>
                  <li><Link to="/mis-tramites">Mis tramites</Link></li>
                  <li><Link to="/">Mis documentos</Link></li>
                  <li><Link to="/">Notificaciones</Link></li>
                  <li><Link to="/">Servicio y soporte</Link></li>
                  <li><Link to="/login" onClick={logout}>Cerrar sesion</Link></li>                  
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="NavBar__bar">
        <div className="NavBar__bar-green" />
        <div className="NavBar__bar-red" />
        <div className="NavBar__bar-blue" />
      </div>
    </nav>
  );
}
