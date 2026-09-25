import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPrincipal from './pages/MenuPrincipal';
import Login from './pages/Login';
import './styles/global.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
