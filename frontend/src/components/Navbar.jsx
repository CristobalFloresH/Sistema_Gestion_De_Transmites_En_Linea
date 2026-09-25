import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ variant = 'public', userName = '' }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">Municipalidad de Santo Domingo</Link>
      </div>
      <div className="navbar__links">
        {variant === 'funcionario' && (
          <Link to="/funcionario/agenda" className="navbar__link">Agenda</Link>
        )}
        <Link to="/tramite-licencia" className="navbar__link">Tramites</Link>
        <Link to="/" className="navbar__link">Contacto</Link>
        {variant === 'public' && (
          <Link to="/login" className="navbar__btn-ingresar">Ingresar</Link>
        )}
        {variant === 'logged' && (
          <div className="navbar__user-area">
            <button
              className="navbar__btn-user"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Hola XXXX
            </button>
            {showDropdown && (
              <div className="navbar__dropdown">
                <div className="navbar__dropdown-header">
                  <div className="navbar__avatar" />
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
          <button className="navbar__btn-user navbar__btn-func">
            Hola Func.XXXX
          </button>
        )}
      </div>
      <div className="navbar__bar">
        <div className="navbar__bar-green" />
        <div className="navbar__bar-red" />
        <div className="navbar__bar-blue" />
      </div>
    </nav>
  );
}
