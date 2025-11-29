import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { getEndTime } from '../../utils/validators';

const Historico = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const result = await supabase
        .from('reservas')
        .select('*')
        .gte('fecha', formatDate(firstDay))
        .lte('fecha', formatDate(lastDay))
        .order('fecha', { ascending: true })
        .order('hora_inicio', { ascending: true });

      if (result.error) {
        console.error('Error fetching reservations:', result.error);
      }

      setReservations(result.data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const canGoNext = () => {
    const today = new Date();
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    return nextMonth <= today;
  };

  const getMonthYearText = () => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return {
      dayName: days[date.getDay()],
      day: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear()
    };
  };

  const activeReservations = reservations.filter(r => r.status === 'activa');
  const cancelledReservations = reservations.filter(r => r.status === 'cancelada');

  if (loading) return <div className="loading">Cargando histórico</div>;

  return (
    <div className="historico-container">
      <div className="historico-header">
        <h2>Histórico de Reservas - Pádel</h2>
        <div className="historico-controls">
          <button onClick={goToPreviousMonth}>← Anterior</button>
          <button onClick={goToCurrentMonth}>Mes Actual</button>
          <button onClick={goToNextMonth} disabled={!canGoNext()}>Siguiente →</button>
        </div>
      </div>

      <div className="historico-month-title">
        <h3>{getMonthYearText()}</h3>
        <p className="historico-count">
          {activeReservations.length} reserva{activeReservations.length !== 1 ? 's' : ''} realizada{activeReservations.length !== 1 ? 's' : ''}
          {cancelledReservations.length > 0 && ` · ${cancelledReservations.length} cancelada${cancelledReservations.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>No hay reservas en este mes</p>
        </div>
      ) : (
        <div className="historico-list">
          {reservations.map((reservation) => {
            const dateInfo = getFormattedDate(reservation.fecha);
            return (
              <div key={reservation.id} className={`historico-item ${reservation.status}`}>
                <div className="historico-date">
                  <div className="historico-day">{dateInfo.day}</div>
                  <div className="historico-month">{dateInfo.month}</div>
                  <div className="historico-year">{dateInfo.year}</div>
                </div>
                <div className="historico-details">
                  <div className="historico-time">
                    <strong>{reservation.hora_inicio}</strong> - {getEndTime(reservation.hora_inicio)}
                  </div>
                  <div className="historico-user">
                    <strong>{reservation.nombre} {reservation.apellidos}</strong>
                  </div>
                  <div className="historico-location">
                    Portal {reservation.portal} · {reservation.piso}{reservation.letra}
                  </div>
                </div>
                <div className={`historico-status ${reservation.status}`}>
                  {reservation.status === 'activa' ? 'Activa' : 'Cancelada'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Historico;
