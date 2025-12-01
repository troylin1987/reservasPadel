import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation
} from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Home from './pages/Home';
import PadelPage from './pages/PadelPage';
import LocalPage from './pages/LocalPage';
import CancelReservation from './components/CancelReservation';
import './App.css';

function AppLayout() {
  const location = useLocation();

  const getHeroClass = () => {
    if (location.pathname.startsWith('/padel')) return 'parallax-hero padel-hero';
    if (location.pathname.startsWith('/local')) return 'parallax-hero local-hero';
    return 'parallax-hero home-hero';
  };

  return (
    <div className="App">
      <div className={getHeroClass()}>
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <strong>Gardenias 2</strong> — Fuenlabrada
            </h1>
            <p className="app-subtitle">Sistema de Gestión Comunitaria</p>
            <nav>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/padel"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Pádel
              </NavLink>
              <NavLink
                to="/local"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Local Comunitario
              </NavLink>
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
        <p>
          © {new Date().getFullYear()} Comunidad de Vecinos —{' '}
          <strong>Gardenias 2</strong> — Fuenlabrada
        </p>
      </footer>
    </div>
  );
}

function App() {
  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
  }, []);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
