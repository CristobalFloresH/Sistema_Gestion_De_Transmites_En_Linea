import React from 'react';
import './ProgressBar.css';

const STEPS = ['Cita', 'Documentos', 'Examenes', 'Pago', 'Impresa', 'Recogida'];

// currentStep: indice (0-6) del ultimo paso completado/actual
export default function ProgressBar({ currentStep = 0 }) {
  return (
    <div className="progress-bar">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`progress-bar__step ${i <= currentStep ? 'active' : ''}`}>
            <div className="progress-bar__dot">{i + 1}</div>
            <span>{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`progress-bar__line ${i < currentStep ? 'active' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
