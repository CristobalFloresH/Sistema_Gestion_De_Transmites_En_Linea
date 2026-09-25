
import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './TramiteLicencia.css';

export default function TramiteLicencia() {
  const [tipoTramite, setTipoTramite] = useState('primera_vez');
  const [mes] = useState('Septiembre 2026');

  return (
    <div className="page tramite-page">
      <NavBar variant="logged" />
      <main className="tramite-content">
        <h1 className="tramite-content__title">
          Tu licencia de conducir, gestionada en linea en la municipalidad de Santo Domingo
        </h1>
        <p className="tramite-content__subtitle">
          Agenda tu hora, sube tus documentos y sigue tu tramite desde un solo lugar.
        </p>

        <div className="tramite-step">
          <div className="step-badge">1</div>
          <div className="step-content">
            <h3>Seleccione el tipo de tramite a realizar</h3>
            <div className="tipo-tramite-options">
              <button
                className={`tipo-btn ${tipoTramite === 'primera_vez' ? 'active' : ''}`}
                onClick={() => setTipoTramite('primera_vez')}
              >
                Licencia (Primera Vez)
              </button>
              <button
                className={`tipo-btn ${tipoTramite === 'renovacion' ? 'active' : ''}`}
                onClick={() => setTipoTramite('renovacion')}
              >
                Renovacion
              </button>
              <button
                className={`tipo-btn ${tipoTramite === 'reimprimir' ? 'active' : ''}`}
                onClick={() => setTipoTramite('reimprimir')}
              >
                Re-imprimir
              </button>
            </div>
          </div>
        </div>

        <div className="tramite-step">
          <div className="step-badge">2</div>
          <div className="step-content">
            <div className="step-header">
              <h3>Elija hora y dia</h3>
              <Link to="/calendario" className="link-green">Busca mas horarios?</Link>
            </div>
            <div className="fecha-selector">
              <div className="fecha-mes">{mes}</div>
              <div className="fecha-dias">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <span key={i} className="fecha-dia-header">{d}</span>
                ))}
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} className={`fecha-dia ${i === 3 ? 'selected' : ''}`}>
                    {i + 8}
                  </span>
                ))}
              </div>
              <div className="hora-selector">
                <label>Bloque: 11 de Septiembre</label>
                <div className="horas-grid">
                  {['09:00', '10:00', '11:00', '12:00'].map(h => (
                    <button key={h} className="hora-btn">{h}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tramite-step">
          <div className="step-badge">3</div>
          <div className="step-content">
            <h3>Carga tus documentos (PDF)</h3>
            <div className="docs-grid">
              <div className="doc-card">Certificado de residencia</div>
              <div className="doc-card">Certificado de educacion basica</div>
              <div className="doc-card">Cedula de Identidad</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
