import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Home from './pages/Home';
import PadelPage from './pages/PadelPage';
import LocalPage from './pages/LocalPage';
import CancelReservation from './components/CancelReservation';
import './App.css';

function App() {
  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="parallax-hero">
          <header className="app-header">
            <div className="header-content">
              <h1 className="app-title">
                <strong>Gardenias 2</strong> — Fuenlabrada
              </h1>
              <p className="app-subtitle">Sistema de Gestión Comunitaria</p>
              <nav>
                <Link to="/">Inicio</Link>
                <Link to="/padel">Pádel</Link>
                <Link to="/local">Local Comunitario</Link>
              </nav>
            </div>
          </header>
        </div>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/padel" element={<PadelPage />} />
            <Route path="/local" element={<LocalPage />} />
            <Route path="/cancelar" element={<CancelReservation />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Comunidad de Vecinos — <strong>Gardenias 2</strong> — Fuenlabrada</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
