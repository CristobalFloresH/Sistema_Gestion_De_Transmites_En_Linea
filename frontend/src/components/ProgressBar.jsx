import React from 'react';
import './ProgressBar.css';

const STEPS = ['Cita', 'Tramites', 'Psicotecnico', 'Foto', 'Impresion', 'Retiro'];

// etapas: nombres de los pasos (cambian segun el tipo de tramite); si no se pasan, se usan los de siempre
export default function ProgressBar({ currentStep = 0, etapas = STEPS }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        {etapas.map((step, i) => (
          <React.Fragment key={step}>
            <div className={`progress-bar__dot ${i <= currentStep ? 'active' : ''}`} />
            {i < etapas.length - 1 && (
              <div className={`progress-bar__line ${i < currentStep ? 'active' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="progress-bar__labels">
        {etapas.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </div>
    </div>
  );
}
