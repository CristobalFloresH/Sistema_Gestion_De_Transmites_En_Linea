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

          {/* Rutas con sesion (ciudadano y funcionario) */}
          <Route path="/tramite-licencia" element={<ProtectedRoute><TramiteLicencia /></ProtectedRoute>} />
          <Route path="/calendario" element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
          <Route path="/tramite-finalizado" element={<ProtectedRoute><TramiteFinalizado /></ProtectedRoute>} />
          <Route path="/mis-tramites" element={<ProtectedRoute><MisTramites /></ProtectedRoute>} />

          {/* Rutas del funcionario */}
          <Route path="/funcionario/agenda" element={<ProtectedRoute rol="funcionario"><AgendaFuncionario /></ProtectedRoute>} />
          <Route path="/funcionario/agenda/proceso" element={<ProtectedRoute rol="funcionario"><AgendaProceso /></ProtectedRoute>} />
          <Route path="/funcionario/agenda/error" element={<ProtectedRoute rol="funcionario"><AgendaProceso hasErrors /></ProtectedRoute>} />

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
