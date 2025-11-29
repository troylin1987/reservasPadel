import React, { useState } from 'react';
import Calendar from '../components/Local/Calendar';
import ReservationForm from '../components/Local/ReservationForm';
import Normativa from '../components/Local/Normativa';
import Historico from '../components/Local/Historico';

const LocalPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showNormativa, setShowNormativa] = useState(false);
  const [showHistorico, setShowHistorico] = useState(false);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleReservationSuccess = () => {
    setShowForm(false);
    window.location.reload();
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (showNormativa) {
    return (
      <div>
        <div className="page-header">
          <button onClick={() => setShowNormativa(false)} className="btn-back">← Volver al calendario</button>
        </div>
        <Normativa />
      </div>
    );
  }

  if (showHistorico) {
    return (
      <div>
        <div className="page-header">
          <button onClick={() => setShowHistorico(false)} className="btn-back">← Volver al calendario</button>
        </div>
        <Historico />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Reservas del Local Comunitario</h1>
        <div className="header-buttons">
          <button onClick={() => setShowHistorico(true)} className="btn-normativa">Ver Histórico</button>
          <button onClick={() => setShowNormativa(true)} className="btn-normativa">Ver Normativa</button>
        </div>
      </div>

      <Calendar onSelectDate={handleSelectDate} />

      {showForm && (
        <div className="modal-overlay">
          <ReservationForm
            selectedDate={selectedDate}
            onSuccess={handleReservationSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}
    </div>
  );
};

export default LocalPage;
