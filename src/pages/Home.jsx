import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-intro">
        <h1>Te damos la bienvenida</h1>
        <p>Realiza tus reservas de forma rápida y sencilla.</p>
      </div>

      <div className="services-grid">
        <Link to="/padel" className="service-card">
          <div className="service-icon">🎾</div>
          <h2>Pista de Pádel</h2>
          <p>Reserva la pista para jugar al pádel. Disponible en horario de 10:00 a 15:00 y de 17:00 a 22:00.</p>
          <div className="service-features">
            <span>✓ Las reservas son de 1h 30min</span>
            <span>✓ Recibirás una confirmación por e-mail, asegúrate de escribirlo bien</span>
            <span>✓ Podrás cancelar la reserva desde un enlace en el propio email</span>
            <span>✓ Al hacer la reserva, aceptas el cumplimiento de la normativa</span>
          </div>
          <div className="btn-view">Ver calendario →</div>
        </Link>

        <Link to="/local" className="service-card">
          <div className="service-icon">🏛️</div>
          <h2>Local Comunitario</h2>
          <p>Reserva el local comunitario para tus eventos. Disponible de 10:00 a 22:00.</p>
          <div className="service-features">
            <span>✓ La reserva es para el día completo</span>
            <span>✓ Sólo se permite una reserva cada 30 días por vivienda</span>
            <span>✓ Recibirás una confirmación por e-mail, asegúrate de escribirlo bien</span>
            <span>✓ Podrás cancelar la reserva desde un enlace en el propio email</span>
            <span>✓ Al hacer la reserva, aceptas el cumplimiento de la normativa</span>
          </div>
          <div className="btn-view">Ver calendario →</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
