import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const CancelReservation = () => {
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const codigo = searchParams.get('codigo');
    if (codigo) {
      fetchReservation(codigo);
    } else {
      setError('No se ha proporcionado un código de cancelación válido.');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchReservation = async (codigo) => {
    try {
      // Buscar primero en reservas de pádel
      let result = await supabase
        .from('reservas')
        .select('*')
        .eq('codigo_cancelacion', codigo)
        .eq('status', 'activa')
        .single();

      let tipo = 'padel';

      // Si no se encuentra, buscar en reservas de local
      if (result.error || !result.data) {
        result = await supabase
          .from('reservas_local')
          .select('*')
          .eq('codigo_cancelacion', codigo)
          .eq('status', 'activa')
          .single();
        
        tipo = 'local';
      }

      if (result.error || !result.data) {
        setError('No se ha encontrado ninguna reserva activa con este código de cancelación.');
      } else {
        setReservation({ ...result.data, tipo });
      }
    } catch (err) {
      console.error('Error fetching reservation:', err);
      setError('Error al buscar la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;

    setCancelling(true);

    try {
      const table = reservation.tipo === 'padel' ? 'reservas' : 'reservas_local';
      
      const { error: updateError } = await supabase
        .from(table)
        .update({ status: 'cancelada' })
        .eq('id', reservation.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      setError('Error al cancelar la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="cancel-container">
        <div className="loading">Cargando información de la reserva...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cancel-container">
        <h2>Cancelar Reserva</h2>
        <div className="message error">{error}</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="cancel-container">
        <h2>Cancelación Confirmada</h2>
        <div className="message success">
          Tu reserva ha sido cancelada correctamente.
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="cancel-container">
        <h2>Cancelar Reserva</h2>
        <div className="message error">No se encontró la reserva.</div>
      </div>
    );
  }

  return (
    <div className="cancel-container">
      <h2>Cancelar Reserva</h2>
      
      <div className="reservation-details">
        <h3>Detalles de la Reserva</h3>
        <p><strong>Tipo:</strong> {reservation.tipo === 'padel' ? 'Pista de Pádel' : 'Local Comunitario'}</p>
        <p><strong>Nombre:</strong> {reservation.nombre} {reservation.apellidos}</p>
        <p><strong>Fecha:</strong> {new Date(reservation.fecha + 'T12:00:00').toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}</p>
        {reservation.tipo === 'padel' && reservation.hora_inicio && (
          <p><strong>Horario:</strong> {reservation.hora_inicio}</p>
        )}
        {reservation.tipo === 'local' && (
          <>
            <p><strong>Horario:</strong> 10:00 - 22:00</p>
            <p><strong>Motivo:</strong> {reservation.motivo}</p>
          </>
        )}
        <p><strong>Portal:</strong> {reservation.portal} - <strong>Piso:</strong> {reservation.piso}{reservation.letra}</p>
      </div>

      <div className="cancel-actions">
        <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          ¿Estás seguro de que deseas cancelar esta reserva?
        </p>
        <button 
          onClick={handleCancelReservation} 
          className="btn-cancel-confirm"
          disabled={cancelling}
        >
          {cancelling ? 'Cancelando...' : 'Sí, cancelar reserva'}
        </button>
      </div>
    </div>
  );
};

export default CancelReservation;
