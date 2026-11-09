import { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { documentTextOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import { getUsuario } from '../services/authService';
import { listarDocumentos, guardarDocumento, eliminarDocumento } from '../services/documentosGuardados';
import './Cuenta.css';

// Documentos que pide la municipalidad. Cada uno se muestra como "Falta" hasta que el usuario sube su PDF.
const TIPOS = [
  { id: 'cedula', nombre: 'Cedula de identidad' },
  { id: 'residencia', nombre: 'Certificado de residencia' },
  { id: 'educacion', nombre: 'Certificado de educacion basica' },
];

const MAX_MB = 5;

function formatearTamano(bytes) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MisDocumentos() {
  // guardados: { cedula: { nombreArchivo, tamano, subido, url }, ... } solo con lo que el usuario realmente subio
  const [guardados, setGuardados] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const urls = useRef([]); // direcciones temporales para abrir los PDF (se liberan al recargar)

  const liberarUrls = () => {
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current = [];
  };

  const cargar = async () => {
    const rut = getUsuario()?.rut;
    try {
      const lista = rut ? await listarDocumentos(rut) : [];
      liberarUrls();
      const porId = {};
      lista.forEach((d) => {
        const url = URL.createObjectURL(d.blob);
        urls.current.push(url);
        porId[d.id] = { ...d, url };
      });
      setGuardados(porId);
    } catch (e) {
      setError(e.message || 'No se pudieron leer tus documentos');
    } finally {
      setCargando(false);
    }
  };

  // Carga al abrir la pagina y cada vez que se vuelve a entrar (por si cambio el usuario)
  useEffect(() => {
    cargar();
    return liberarUrls;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useIonViewWillEnter(() => { cargar(); });

  const subir = async (tipo, e) => {
    const input = e.target;
    const archivo = input.files?.[0];
    input.value = ''; // permite volver a elegir el mismo archivo
    if (!archivo) return;
    if (archivo.type !== 'application/pdf') {
      setError('Solo se aceptan archivos PDF');
      return;
    }
    if (archivo.size > MAX_MB * 1024 * 1024) {
      setError(`El archivo supera los ${MAX_MB} MB`);
      return;
    }
    const rut = getUsuario()?.rut;
    if (!rut) {
      setError('Tu sesion expiro. Inicia sesion de nuevo');
      return;
    }
    try {
      await guardarDocumento(rut, tipo.id, archivo);
      setError('');
      await cargar();
    } catch {
      setError('No se pudo guardar el archivo. Intenta de nuevo');
    }
  };

  const eliminar = async (tipo) => {
    if (!window.confirm(`Eliminar "${tipo.nombre}"?`)) return;
    try {
      await eliminarDocumento(getUsuario()?.rut, tipo.id);
      setError('');
      await cargar();
    } catch {
      setError('No se pudo eliminar el archivo');
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <NavBar />
          <main className="cuenta-content">
            <h1 className="cuenta-title">Mis documentos</h1>
            <p className="cuenta-subtitle">Guarda tus documentos una vez y usalos en tus proximos tramites</p>
            {error && <p className="notif-error" style={{ color: 'var(--err-text)', marginBottom: 12 }}>{error}</p>}

            {cargando ? (
              <p className="cuenta-vacio">Cargando tus documentos...</p>
            ) : (
              <div className="mis-docs">
                {TIPOS.map((tipo) => {
                  const doc = guardados[tipo.id];
                  return (
                    <article key={tipo.id} className={`mi-doc ${doc ? '' : 'falta'}`}>
                      <div className="mi-doc__top">
                        <span className="mi-doc__icono"><IonIcon icon={documentTextOutline} /></span>
                        <span className={`pill ${doc ? 'aprobado' : 'pendiente'}`}>{doc ? 'Cargado' : 'Falta'}</span>
                      </div>
                      <h3>{tipo.nombre}</h3>
                      {doc && (
                        <>
                          <p className="mi-doc__archivo">{doc.nombreArchivo}</p>
                          <p className="mi-doc__meta">
                            Subido: {new Date(doc.subido).toLocaleDateString('es-CL')} · {formatearTamano(doc.tamano)}
                          </p>
                        </>
                      )}
                      <div className="mi-doc__acciones">
                        {doc && (
                          <a className="btn-doc" href={doc.url} target="_blank" rel="noreferrer">Ver</a>
                        )}
                        <label className={`btn-doc ${doc ? '' : 'lleno'}`}>
                          {doc ? 'Cambiar' : 'Subir'}
                          <input type="file" accept="application/pdf" hidden onChange={(e) => subir(tipo, e)} />
                        </label>
                        {doc && (
                          <button type="button" className="btn-doc peligro" onClick={() => eliminar(tipo)}>Eliminar</button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
