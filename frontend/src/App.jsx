import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProgressBar from './components/ProgressBar';
import './styles/global.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar variant="logged" /><ProgressBar currentStep={2} /></>} />
      </Routes>
    </Router>
  );
}
