import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import NavBar from '../components/NavBar';
import './AgendaFuncionario.css';

const CITAS = [
  { hora: '09:00', rut: '12.124.876-K', nombre: 'Juan Lopez', tramite: 'Licencia Nueva', estado: 'Pendiente', estadoClass: 'pendiente' },
  { hora: '10:00', rut: '12.234.345-8', nombre: 'Emilia Bravo', tramite: 'Renovacion', estado: 'Aprobado', estadoClass: 'aprobado' },
  { hora: '11:00', rut: '20.276.215-K', nombre: 'Pedro Roca', tramite: 'Renovacion', estado: 'Rechazado', estadoClass: 'rechazado' },
  { hora: '12:00', rut: '18.391.310-8', nombre: 'Mateo Dimter', tramite: 'Licencia Nueva', estado: 'Aprobado', estadoClass: 'aprobado' },
  { hora: '12:00', rut: '12.234.345-7', nombre: 'Martin Fierro', tramite: 'Licencia Nueva', estado: 'Pendiente', estadoClass: 'pendiente' },
  { hora: '13:00', rut: '21.233.983-8', nombre: 'Alejandro Garces', tramite: 'Reimpresion', estado: 'Rechazado', estadoClass: 'rechazado' },
  { hora: '13:00', rut: '19.231.376-K', nombre: 'Amelia Gaete', tramite: 'Reimpresion', estado: 'Pendiente', estadoClass: 'pendiente' },
  { hora: '15:00', rut: '21.270.345-7', nombre: 'Sofia Rojas', tramite: 'Renovacion', estado: 'Aprobado', estadoClass: 'aprobado' },
  { hora: '15:00', rut: '12.250.125-8', nombre: 'Rodolfo Silva', tramite: 'Licencia Nueva', estado: 'Rechazado', estadoClass: 'rechazado' },
];

export default function AgendaFuncionario() {
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTramite, setFiltroTramite] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const citasFiltradas = CITAS.filter(c => {
    if (filtroEstado && c.estado !== filtroEstado) return false;
    if (filtroTramite && c.tramite !== filtroTramite) return false;
    if (busqueda && !c.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !c.rut.includes(busqueda)) return false;
    return true;
  });

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="agenda-content">
            <h1 className="agenda-title">Agenda</h1>
            <div className="agenda-filters">
              <div className="filter-search">
                <span>&#128269;</span>
                <input type="text" placeholder="Buscar por RUT / Nombre"
                  value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
              <select className="filter-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
              <select className="filter-select" value={filtroTramite} onChange={(e) => setFiltroTramite(e.target.value)}>
                <option value="">Todos los tramites</option>
                <option value="Licencia Nueva">Licencia Nueva</option>
                <option value="Renovacion">Renovacion</option>
                <option value="Reimpresion">Reimpresion</option>
              </select>
            </div>
            <table className="agenda-table">
              <thead>
                <tr><th>Hora</th><th>RUT</th><th>Nombre</th><th>Tramite</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {citasFiltradas.map((c, i) => (
                  <tr key={i}>
                    <td className="td-hora">{c.hora}</td>
                    <td>{c.rut}</td>
                    <td>{c.nombre}</td>
                    <td>{c.tramite}</td>
                    <td><span className={`estado-label ${c.estadoClass}`}>{c.estado}</span></td>
                    <td>
                      <Link
                        to={c.estado === 'Rechazado' ? '/funcionario/agenda/error' : '/funcionario/agenda/proceso'}
                        className="link-action"
                      >
                        Ver proceso del tramite
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
