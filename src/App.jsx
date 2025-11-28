import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Calendar from './components/Calendar';
import ReservationForm from './components/ReservationForm';
import Normativa from './components/Normativa';
import CancelReservation from './components/CancelReservation';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSelectSlot = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    setShowForm(true);
  };

  const handleReservationSuccess = () => {
    setShowForm(false);
    window.location.reload();
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <Router>
      <div className="App">
        <div className="parallax-hero">
          <header className="app-header">
            <div className="header-content">
              <h1 className="app-title">
                <strong>Gardenias 2</strong> — Pádel
              </h1>
              <p className="app-subtitle">Sistema de Reservas</p>
              <nav>
                <Link to="/">Calendario</Link>
                <Link to="/normativa">Normativa</Link>
              </nav>
            </div>
          </header>
        </div>

        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <>
                <Calendar onSelectSlot={handleSelectSlot} />
                {showForm && (
                  <div className="modal-overlay">
                    <ReservationForm
                      selectedDate={selectedDate}
                      selectedSlot={selectedSlot}
                      onSuccess={handleReservationSuccess}
                      onCancel={handleCancelForm}
                    />
                  </div>
                )}
              </>
            } />
            <Route path="/normativa" element={<Normativa />} />
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
