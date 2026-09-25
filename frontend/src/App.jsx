import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Proyecto funcionando</h1>} />
      </Routes>
    </Router>
  );
}
