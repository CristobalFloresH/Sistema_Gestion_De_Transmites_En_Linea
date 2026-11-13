import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react';
//Funciones para obtener al usuario desde el localStorage
import { getUsuario, logout } from '../services/authService';
import { usePreferencias } from '../hooks/usePreferencias';
import './NavBar.css';

export default function NavBar() {
  //Estado menu desplegable
  const [showDropdown, setShowDropdown] = useState(false);
  //Estadi que guarda la informacion del usuario
  const [usuario, setUsuario] = useState(getUsuario());
  const { tema, escalaFuente, toggleTema, aumentarFuente, disminuirFuente } = usePreferencias();
  useIonViewWillEnter(() => {
    setUsuario(getUsuario());
    setShowDropdown(false);
  });

  //Sistema de roles
  let variant = 'public';
  if (usuario?.rol === 'ciudadano') variant = 'logged';
  if (usuario?.rol === 'funcionario' || usuario?.rol === 'administrador') variant = 'funcionario';

  return (
    <nav className="NavBar">
      <div className="NavBar__logo">
        <Link to="/">Municipalidad de Santo Domingo</Link>
      </div>
      <div className="NavBar__links">
        <div className="NavBar__accesibilidad" aria-label="Controles de accesibilidad">
          <button type="button" className="NavBar__btn-acces" onClick={disminuirFuente} aria-label="Disminuir tamaño de letra" title="Disminuir letra">A−</button>
          <span className="NavBar__escala" aria-live="polite">{Math.round(escalaFuente * 100)}%</span>
          <button type="button" className="NavBar__btn-acces" onClick={aumentarFuente} aria-label="Aumentar tamaño de letra" title="Aumentar letra">A+</button>
          <button type="button" className="NavBar__btn-acces NavBar__btn-tema" onClick={toggleTema} aria-label={tema === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro'} title={tema === 'claro' ? 'Modo oscuro' : 'Modo claro'}>{tema === 'claro' ? '🌙' : '☀️'}</button>
        </div>
        {variant === 'funcionario' && (
          <>
            <Link to="/funcionario/agenda" className="NavBar__link">Agenda</Link>
            <Link to="/funcionario/bloques" className="NavBar__link">Bloques</Link>
            {usuario?.rol === 'administrador' && (
              <Link to="/admin/funcionarios" className="NavBar__link">Funcionarios</Link>
            )}
          </>
        )}
        <Link to="/tramite-licencia" className="NavBar__link">Tramites</Link>
        <Link to="/" className="NavBar__link">Contacto</Link>
        {variant === 'public' && (
          <Link to="/login" className="NavBar__btn-ingresar">Ingresar</Link>
        )}
        {variant !== 'public' && (
          <div className="NavBar__user-area">
            <button
              className={'NavBar__btn-user'}
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
                  <li><Link to="/perfil">Mi perfil</Link></li>
                  <li><Link to="/mis-tramites">Mis tramites</Link></li>
                  <li><Link to="/mis-documentos">Mis documentos</Link></li>
                  <li><Link to="/notificaciones">Notificaciones</Link></li>
                  <li><Link to="/">Servicio y soporte</Link></li>
                  <li><Link to="/login" onClick={logout}>Cerrar sesion</Link></li>                  
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="NavBar__bar">
        <div className="NavBar__bar-red" />
        <div className="NavBar__bar-blue" />
      </div>
    </nav>
  );
}
