import { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar({ variant = 'public', userName = '' }) {
  const [showDropdown, setShowDropdown] = useState(false);

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
        {variant === 'logged' && (
          <div className="NavBar__user-area">
            <button
              className="NavBar__btn-user"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Hola {userName || 'XXXX'}
            </button>
            {showDropdown && (
              <div className="NavBar__dropdown">
                <div className="NavBar__dropdown-header">
                  <div className="NavBar__avatar" />
                  <div>
                    <strong>Juan Lopez</strong>
                    <p>Ciudadano</p>
                  </div>
                </div>
                <ul>
                  <li><Link to="/">Mi perfil</Link></li>
                  <li><Link to="/mis-tramites">Mis tramites</Link></li>
                  <li><Link to="/">Mis documentos</Link></li>
                  <li><Link to="/">Notificaciones</Link></li>
                  <li><Link to="/">Servicio y soporte</Link></li>
                </ul>
              </div>
            )}
          </div>
        )}
        {variant === 'funcionario' && (
          <button className="NavBar__btn-user NavBar__btn-func">
            Hola Func.XXXX
          </button>
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
