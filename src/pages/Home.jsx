import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-intro">
        <h1>Bienvenido al Sistema de Reservas</h1>
        <p>Gestiona tus reservas de pádel y del local comunitario de forma rápida y sencilla.</p>
      </div>

      <div className="services-grid">
        <Link to="/padel" className="service-card">
          <div className="service-icon">🎾</div>
          <h2>Pista de Pádel</h2>
          <p>Reserva tu franja horaria para jugar al pádel. Disponible en horarios de 10:00 a 21:30.</p>
          <div className="service-features">
            <span>✓ Reservas de 1h 30min</span>
            <span>✓ Confirmación por email</span>
            <span>✓ Cancelación online</span>
          </div>
          <div className="btn-view">Ver calendario →</div>
        </Link>

        <Link to="/local" className="service-card">
          <div className="service-icon">🏢</div>
          <h2>Local Comunitario</h2>
          <p>Reserva el local comunitario para tus eventos. Disponible de 10:00 a 22:00.</p>
          <div className="service-features">
            <span>✓ Reserva por día completo</span>
            <span>✓ 1 reserva al mes</span>
            <span>✓ Confirmación por email</span>
          </div>
          <div className="btn-view">Ver calendario →</div>
        </Link>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>📋 Normativas</h3>
          <p>Cada espacio tiene su propia normativa de uso. Consúltala antes de hacer tu reserva.</p>
        </div>
        <div className="info-card">
          <h3>📧 Confirmación</h3>
          <p>Recibirás un email de confirmación con tu código de cancelación.</p>
        </div>
        <div className="info-card">
          <h3>⚡ Fácil y rápido</h3>
          <p>Reserva en segundos y gestiona tus reservas desde cualquier dispositivo.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
