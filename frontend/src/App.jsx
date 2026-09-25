import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import MenuPrincipal from './pages/MenuPrincipal';
import Login from './pages/Login';
import TramiteLicencia from './pages/TramiteLicencia';
import Calendario from './pages/Calendario';
import TramiteFinalizado from './pages/TramiteFinalizado';
import MisTramites from './pages/MisTramites';
import ListaDesplegable from './pages/ListaDesplegable';
import FuncionarioMenu from './pages/FuncionarioMenu';
import AgendaFuncionario from './pages/AgendaFuncionario';
import AgendaProceso from './pages/AgendaProceso';
import AgendaErrorFuncionario from './pages/AgendaErrorFuncionario';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import ProtectedRoute from './routes/ProtectedRoute';

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

          {/* Rutas del ciudadano */}
          <Route path="/tramite-licencia" element={<ProtectedRoute rol="ciudadano"><TramiteLicencia /></ProtectedRoute>} />
          <Route path="/calendario" element={<ProtectedRoute rol="ciudadano"><Calendario /></ProtectedRoute>} />
          <Route path="/tramite-finalizado" element={<ProtectedRoute rol="ciudadano"><TramiteFinalizado /></ProtectedRoute>} />
          <Route path="/mis-tramites" element={<ProtectedRoute rol="ciudadano"><MisTramites /></ProtectedRoute>} />
          <Route path="/lista-desplegable" element={<ProtectedRoute rol="ciudadano"><ListaDesplegable /></ProtectedRoute>} />

          {/* Rutas del funcionario */}
          <Route path="/funcionario" element={<ProtectedRoute rol="funcionario"><FuncionarioMenu /></ProtectedRoute>} />
          <Route path="/funcionario/agenda" element={<ProtectedRoute rol="funcionario"><AgendaFuncionario /></ProtectedRoute>} />
          <Route path="/funcionario/agenda/proceso" element={<ProtectedRoute rol="funcionario"><AgendaProceso /></ProtectedRoute>} />
          <Route path="/funcionario/agenda/error" element={<ProtectedRoute rol="funcionario"><AgendaErrorFuncionario /></ProtectedRoute>} />

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
