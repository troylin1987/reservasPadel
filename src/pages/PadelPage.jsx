import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from '../components/Padel/Calendar';
import ReservationForm from '../components/Padel/ReservationForm';
import Normativa from '../components/Padel/Normativa';

const PadelPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showNormativa, setShowNormativa] = useState(false);

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

  return (
    <div>
      <div className="page-header">
        <h1>Reservas de Pádel</h1>
        <button onClick={() => setShowNormativa(true)} className="btn-normativa">Ver Normativa</button>
      </div>

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
    </div>
  );
};

export default PadelPage;
