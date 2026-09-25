import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import './AgendaProceso.css';

export default function AgendaProceso({ hasErrors = false }) {
  return (
    <div className="page">
      <Navbar variant="funcionario" />
      <main className="proceso-content">
        <div className="proceso-breadcrumb">
          <Link to="/funcionario/agenda" className="proceso-breadcrumb__link">Agenda</Link>
          <span> &gt; </span>
          <span>Proceso del tramite</span>
        </div>
        <div className="proceso-progress">
          <ProgressBar currentStep={1} />
        </div>
        <div className="proceso-panels">
          <div className="proceso-panel">
            <h3>Documentos adjuntados</h3>
            <div className="doc-list">
              <div className="doc-item">
                <span>Cedula_de_identidad.pdf</span>
                <a href="#" className="link-action">ver</a>
              </div>
              <div className="doc-item">
                <span>Certificado_de_ residencia.pdf</span>
                <a href="#" className="link-action">ver</a>
              </div>
            </div>
            <div className="doc-icons">
              <div className="pdf-icon">PDF<br /><small>105 KB</small></div>
              <div className="pdf-icon">PDF<br /><small>80 KB</small></div>
            </div>
          </div>
          <div className="proceso-panel">
            <h3>Validar veracidad de los documentos</h3>
            <ul className="validacion-list">
              <li className={hasErrors ? 'error' : 'ok'}>
                <span>{hasErrors ? '✕' : '✓'}</span> Datos coinciden con RUT
              </li>
              <li className={hasErrors ? 'error' : 'ok'}>
                <span>{hasErrors ? '✕' : '✓'}</span> Documento legible
              </li>
              <li className="ok"><span>✓</span> Cumple normativa vigente</li>
            </ul>
            <div className="validacion-actions">
              <button className="btn-validacion rechazar">Rechazar</button>
              <button className="btn-validacion aprobar">Aprobar</button>
            </div>
            <div className="historial">
              <h4>Historial de tramites</h4>
              <div className="historial-item">
                <span>Renovacion 2026</span>
                <span className="historial-estado proceso">En proceso</span>
              </div>
              <div className="historial-item">
                <span>Licencia B nueva 2022</span>
                <span className="historial-estado completado">Completado</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
