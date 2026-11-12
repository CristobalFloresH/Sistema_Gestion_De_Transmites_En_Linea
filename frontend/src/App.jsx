import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import MenuPrincipal from './pages/MenuPrincipal';
import Login from './pages/Login';
import TramiteLicencia from './pages/TramiteLicencia';
import Calendario from './pages/Calendario';
import TramiteFinalizado from './pages/TramiteFinalizado';
import MisTramites from './pages/MisTramites';
import AgendaFuncionario from './pages/AgendaFuncionario';
import AgendaProceso from './pages/AgendaProceso';
import BloquesHorarios from './pages/BloquesHorarios';
import Funcionarios from './pages/Funcionarios';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import ProtectedRoute from './routes/ProtectedRoute';
import MiPerfil from './pages/MiPerfil';
import MisDocumentos from './pages/MisDocumentos';
import Notificaciones from './pages/Notificaciones';
import './styles/global.css';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
                    {/* Rutas públicas */}
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tramite-licencia" element={<ProtectedRoute><TramiteLicencia /></ProtectedRoute>} />
          <Route path="/calendario" element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
          <Route path="/tramite-finalizado" element={<ProtectedRoute><TramiteFinalizado /></ProtectedRoute>} />
          <Route path="/mis-tramites" element={<ProtectedRoute><MisTramites /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
          <Route path="/mis-documentos" element={<ProtectedRoute><MisDocumentos /></ProtectedRoute>} />
          <Route path="/notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />

          {/* Rutas del funcionario */}
          <Route path="/funcionario/agenda" element={<ProtectedRoute rol="funcionario"><AgendaFuncionario /></ProtectedRoute>} />
          {/* El proceso se abre con el id del tramite: antes habia una ruta fija y otra de ejemplo con error */}
          <Route path="/funcionario/tramites/:idTramite" element={<ProtectedRoute rol="funcionario"><AgendaProceso /></ProtectedRoute>} />
          <Route path="/funcionario/bloques" element={<ProtectedRoute rol="funcionario"><BloquesHorarios /></ProtectedRoute>} />
          <Route path="/admin/funcionarios" element={<ProtectedRoute rol="administrador"><Funcionarios /></ProtectedRoute>} />

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
