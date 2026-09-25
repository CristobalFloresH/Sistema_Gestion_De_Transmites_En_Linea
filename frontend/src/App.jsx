import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './styles/global.css';


export default function App() {
  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}
