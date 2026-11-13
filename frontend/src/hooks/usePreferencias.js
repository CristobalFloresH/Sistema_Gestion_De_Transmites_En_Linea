import { useEffect, useState } from 'react';

const KEY_TEMA = 'app-tema';
const KEY_FUENTE = 'app-fuente';

export function usePreferencias() {
  const [tema, setTema] = useState(() => localStorage.getItem(KEY_TEMA) || 'claro');
  const [escalaFuente, setEscalaFuente] = useState(() => {
    const guardada = Number(localStorage.getItem(KEY_FUENTE));
    return Number.isFinite(guardada) && guardada >= 0.8 && guardada <= 1.4 ? guardada : 1;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', tema === 'oscuro');
    root.style.setProperty('--font-scale', String(escalaFuente));
    // Escala el contenido completo para que también aumenten los textos definidos en px.
    root.style.zoom = escalaFuente === 1 ? '' : String(escalaFuente);
    localStorage.setItem(KEY_TEMA, tema);
    localStorage.setItem(KEY_FUENTE, String(escalaFuente));
  }, [tema, escalaFuente]);

  const toggleTema = () => setTema((actual) => actual === 'claro' ? 'oscuro' : 'claro');
  const aumentarFuente = () => setEscalaFuente((actual) => Math.min(1.4, +(actual + 0.1).toFixed(1)));
  const disminuirFuente = () => setEscalaFuente((actual) => Math.max(0.8, +(actual - 0.1).toFixed(1)));

  return { tema, escalaFuente, toggleTema, aumentarFuente, disminuirFuente };
}
