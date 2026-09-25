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

import './styles/global.css';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tramite-licencia" element={<TramiteLicencia />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/tramite-finalizado" element={<TramiteFinalizado />} />
          <Route path="/mis-tramites" element={<MisTramites />} />
          <Route path="/lista-desplegable" element={<ListaDesplegable />} />
          <Route path="/funcionario" element={<FuncionarioMenu />} />
          <Route path="/funcionario/agenda" element={<AgendaFuncionario />} />
          <Route path="/funcionario/agenda/proceso" element={<AgendaProceso />} />
          <Route path="/funcionario/agenda/error" element={<AgendaErrorFuncionario />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
