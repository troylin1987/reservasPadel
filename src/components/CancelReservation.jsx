import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const CancelReservation = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [reservation, setReservation] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codigo = params.get('codigo');
    
    if (codigo) {
      fetchReservation(codigo);
    } else {
      setMessage('Código de cancelación no válido');
    }
  }, [location]);

  const fetchReservation = async (codigo) => {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('codigo_cancelacion', codigo)
        .eq('status', 'activa')
        .single();

      if (error) throw error;
      
      if (data) {
        setReservation(data);
      } else {
        setMessage('Reserva no encontrada o ya cancelada');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Reserva no encontrada o ya cancelada');
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('reservas')
        .update({ status: 'cancelada' })
        .eq('id', reservation.id);

      if (error) throw error;

      setMessage('✓ Reserva cancelada correctamente');
      setReservation(null);
    } catch (error) {
      console.error('Error canceling reservation:', error);
      setMessage('Error al cancelar la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-container">
      <h2>Cancelar Reserva</h2>
      
      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {reservation && (
        <div className="reservation-details">
          <h3>Detalles de la Reserva</h3>
          <p><strong>Fecha:</strong> {reservation.fecha}</p>
          <p><strong>Hora:</strong> {reservation.hora_inicio}</p>
          <p><strong>Nombre:</strong> {reservation.nombre} {reservation.apellidos}</p>
          <p><strong>Portal:</strong> {reservation.portal} - {reservation.piso}{reservation.letra}</p>
          
          <div className="cancel-actions">
            <button 
              onClick={handleCancel} 
              className="btn-cancel-confirm"
              disabled={loading}
            >
              {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelReservation;
