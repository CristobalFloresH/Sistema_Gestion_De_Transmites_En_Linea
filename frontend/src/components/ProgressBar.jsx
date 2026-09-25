import React from 'react';
import './ProgressBar.css';

const STEPS = ['Cita', 'Tramites', 'Psicotecnico', 'Foto', 'Impresion', 'Retiro'];

export default function ProgressBar({ currentStep = 0 }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className={`progress-bar__dot ${i <= currentStep ? 'active' : ''}`} />
            {i < STEPS.length - 1 && (
              <div className={`progress-bar__line ${i < currentStep ? 'active' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="progress-bar__labels">
        {STEPS.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </div>
    </div>
  );
}
