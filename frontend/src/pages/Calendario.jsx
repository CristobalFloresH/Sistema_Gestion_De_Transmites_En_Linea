import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonSpinner, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { listarBloquesPorFecha } from '../services/bloqueHorarioService';
import { buscarTipo, leerReserva, guardarReserva } from '../services/reserva';
import './Calendario.css';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const dos = (n) => String(n).padStart(2, '0');
const aIso = (anio, mes, dia) => `${anio}-${dos(mes + 1)}-${dos(dia)}`;

function fechaDeHoy() {
  const h = new Date();
  return aIso(h.getFullYear(), h.getMonth(), h.getDate());
}

function formatearFecha(fechaIso) {
  const fecha = new Date(`${fechaIso.slice(0, 10)}T12:00:00`);
  const texto = fecha.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function Calendario() {
  const hoy = fechaDeHoy();
  const [anio, setAnio] = useState(Number(hoy.slice(0, 4)));
  const [mes, setMes] = useState(Number(hoy.slice(5, 7)) - 1);
  const [fecha, setFecha] = useState(hoy);
  const [bloque, setBloque] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [tipo, setTipo] = useState(() => buscarTipo(leerReserva().tipo));
  const [paso, setPaso] = useState(1); // 1 = dia y hora, 2 = documentos
  const [archivos, setArchivos] = useState({});
  const [errorArchivo, setErrorArchivo] = useState('');

  // Cada vez que se entra a la pagina se lee el tramite elegido y se parte del paso 1
  useIonViewWillEnter(() => {
    setTipo(buscarTipo(leerReserva().tipo));
    setPaso(1);
    setArchivos({});
    setErrorArchivo('');
  });

  const elegirArchivo = (nombreDoc, e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (archivo.type !== 'application/pdf') {
      setErrorArchivo('Solo se aceptan archivos PDF');
      return;
    }
    setErrorArchivo('');
    setArchivos({ ...archivos, [nombreDoc]: archivo });
  };

  const docsCompletos = tipo ? tipo.documentos.every((d) => archivos[d]) : false;

  const irADocumentos = () => {
    guardarReserva({ fecha, hora: bloque.hora_inicio.slice(0, 5), id_bloque_horario: bloque.id_bloque_horario });
    setPaso(2);
  };

  useEffect(() => {
    let vigente = true;
    listarBloquesPorFecha(fecha)
      .then((datos) => { if (vigente) setBloques(datos); })
      .catch((e) => { if (vigente) { setBloques([]); setError(e.mensaje); } })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [fecha]);

  const elegirDia = (iso) => {
    setFecha(iso);
    setBloque(null);
    setCargando(true);
    setError('');
  };

  const cambiarMes = (delta) => {
    const nuevo = new Date(anio, mes + delta, 1);
    setAnio(nuevo.getFullYear());
    setMes(nuevo.getMonth());
  };

  // Grilla del mes (semana empieza el lunes)
  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const diasDelMes = new Date(anio, mes + 1, 0).getDate();
  const celdas = [
    ...Array(primerDia).fill(null),
    ...Array.from({ length: diasDelMes }, (_, i) => i + 1),
  ];
  const esMesActual = anio === Number(hoy.slice(0, 4)) && mes === Number(hoy.slice(5, 7)) - 1;

  return (
    <IonPage>
      <IonContent>
        <div className="page calendario-page">
          <NavBar />
          <main className="reserva">
            <h1 className="reserva__title">Reserva tu hora</h1>
            <p className="reserva__subtitle">
              Agenda tu hora, sube tus documentos y sigue tu tramite desde un solo lugar.
            </p>
            <ol className="reserva-pasos">
              <li className={paso === 1 ? 'activo' : 'hecho'}>1.- Dia y Hora</li>
              <li className="reserva-pasos__flecha">→</li>
              <li className={paso === 2 ? 'activo' : ''}>2.- Documentos</li>
              <li className="reserva-pasos__flecha">→</li>
              <li>3.- Confirmacion</li>
            </ol>
            {!tipo && (
              <p className="reserva-aviso">
                Primero debes elegir el tipo de tramite. <Link to="/tramite-licencia">Elegir tramite</Link>
              </p>
            )}
            {tipo && (
              <p className="reserva-tipo">
                Tramite: <strong>{tipo.nombre}</strong> · <Link to="/tramite-licencia">Cambiar</Link>
              </p>
            )}

            {tipo && paso === 1 && (
            <div className="reserva-body">
              <div className="reserva-card cal-card">
                <div className="cal-head">
                  <h3>{MESES[mes]} {anio}</h3>
                  <div className="cal-nav">
                    <button type="button" aria-label="Mes anterior" onClick={() => cambiarMes(-1)} disabled={esMesActual}>&lt;</button>
                    <button type="button" aria-label="Mes siguiente" onClick={() => cambiarMes(1)}>&gt;</button>
                  </div>
                </div>
                <div className="cal-grid">
                  {DIAS_SEMANA.map((d, i) => <span key={i} className="cal-semana">{d}</span>)}
                  {celdas.map((dia, i) => {
                    if (dia === null) return <span key={`v${i}`} />;
                    const iso = aIso(anio, mes, dia);
                    const pasado = iso < hoy;
                    const clases = ['cal-dia', pasado ? 'pasado' : '', iso === fecha ? 'selected' : '', iso === hoy ? 'hoy' : '']
                      .filter(Boolean).join(' ');
                    return (
                      <button type="button" key={iso} className={clases} disabled={pasado} onClick={() => elegirDia(iso)}>
                        {dia}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="reserva-card horas-panel">
                <h3>Horario disponible</h3>
                <p className="horas-panel__fecha">{formatearFecha(fecha)}</p>
                <div className="horas-list">
                  {cargando && <IonSpinner name="crescent" />}
                  {!cargando && error && <p>{error}</p>}
                  {!cargando && !error && bloques.length === 0 && (
                    <p>No hay bloques disponibles para este día</p>
                  )}
                  {!cargando && bloques.map((b) => {
                    const elegido = bloque?.id_bloque_horario === b.id_bloque_horario;
                    return (
                      <button
                        type="button"
                        key={b.id_bloque_horario}
                        className={`hora-slot ${elegido ? 'selected' : ''}`}
                        disabled={b.cupos_disponibles === 0}
                        onClick={() => setBloque(b)}>
                        <span className="hora-slot__radio" />
                        <span className="hora-slot__hora">{b.hora_inicio.slice(0, 5)}</span>
                        <span className="hora-slot__cupos">{b.cupos_disponibles} cupos</span>
                      </button>
                    );
                  })}
                </div>
                <p className="horas-panel__resumen">
                  {bloque && (
                    <>Seleccionaste: <strong>{formatearFecha(fecha)}, {bloque.hora_inicio.slice(0, 5)}</strong></>
                  )}
                </p>
                <IonButton
                  disabled={!bloque}
                  onClick={irADocumentos}
                  className="btn btn--green calendario-continuar">
                  Continuar <IonIcon slot="end" icon={arrowForward} />
                </IonButton>
              </div>
            </div>
            )}

            {tipo && paso === 2 && (
              <div className="reserva-card subida-card">
                <h3>Carga tus documentos (PDF)</h3>
                <p className="horas-panel__fecha">Cita: {formatearFecha(fecha)}, {bloque?.hora_inicio.slice(0, 5)}</p>
                <div className="subida-grid">
                  {tipo.documentos.map((nombreDoc) => (
                    <label key={nombreDoc} className={`subida-doc ${archivos[nombreDoc] ? 'cargado' : ''}`}>
                      <input type="file" accept="application/pdf" hidden onChange={(e) => elegirArchivo(nombreDoc, e)} />
                      <span>{nombreDoc}</span>
                      {archivos[nombreDoc] && <small>{archivos[nombreDoc].name}</small>}
                    </label>
                  ))}
                </div>
                {errorArchivo && <p className="subida-error">{errorArchivo}</p>}
                <div className="subida-acciones">
                  <IonButton className="btn btn--outline calendario-continuar" onClick={() => setPaso(1)}>Volver</IonButton>
                  <IonButton
                    routerLink="/tramite-finalizado"
                    disabled={!docsCompletos}
                    className="btn btn--green calendario-continuar">
                    Continuar <IonIcon slot="end" icon={arrowForward} />
                  </IonButton>
                </div>
              </div>
            )}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
