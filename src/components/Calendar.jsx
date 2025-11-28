import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SLOTS } from '../utils/validators';

const Calendar = ({ onSelectSlot }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDays = () => {
    const dates = [];
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const daysToShow = isMobile ? 3 : 7;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      dates.push(formatDate(date));
    }
    
    return dates;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dates = getDays();

  const fetchReservations = useCallback(async () => {
    try {
      const result = await supabase
        .from('reservas')
        .select('*')
        .eq('status', 'activa')
        .in('fecha', dates);

      if (result.error) throw result.error;
      setReservations(result.data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      alert('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  }, [dates]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const getReservationForSlot = (date, slot) => {
    return reservations.find(r => r.fecha === date && r.hora_inicio === slot);
  };

  const getDayName = (dateStr) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const date = new Date(dateStr + 'T12:00:00');
    return days[date.getDay()];
  };

  const getMonthYear = (dateStr) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(dateStr + 'T12:00:00');
    return `${months[date.getMonth()]} '${String(date.getFullYear()).slice(-2)}`;
  };

  const goToPrevious = () => {
    const newDate = new Date(startDate);
    const daysToMove = isMobile ? 3 : 7;
    newDate.setDate(newDate.getDate() - daysToMove);
    setStartDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(startDate);
    const daysToMove = isMobile ? 3 : 7;
    newDate.setDate(newDate.getDate() + daysToMove);
    setStartDate(newDate);
  };

  const goToToday = () => {
    setStartDate(new Date());
  };

  if (loading) return <div className="loading">Cargando calendario</div>;

  return (
    <div className="calendar-container">
      <div className="calendar-header-section">
        <h2>Disponibilidad de Pista</h2>
        <div className="calendar-controls">
          <button onClick={goToPrevious}>← Anterior</button>
          <button onClick={goToToday}>Hoy</button>
          <button onClick={goToNext}>Siguiente →</button>
        </div>
      </div>

      <div className="calendar-grid-wrapper">
        <div className="calendar-grid" data-mobile={isMobile}>
          <div className="calendar-header">
            <div className="time-column-header">Horario</div>
            {dates.map(date => (
              <div key={date} className="date-column">
                <div className="day-name">{getDayName(date)}</div>
                <div className="date-info">{new Date(date + 'T12:00:00').getDate()}</div>
                <div className="date-month-year">{getMonthYear(date)}</div>
              </div>
            ))}
          </div>

          {SLOTS.map(slot => (
            <div key={slot} className="calendar-row">
              <div className="time-cell">{slot}</div>
              {dates.map(date => {
                const reservation = getReservationForSlot(date, slot);
                
                return (
                  <div 
                    key={`${date}-${slot}`} 
                    className={`slot-cell ${reservation ? 'occupied' : 'available'}`}
                    onClick={() => !reservation && onSelectSlot(date, slot)}
                    title={reservation ? `${reservation.nombre} ${reservation.apellidos} - Portal ${reservation.portal}, ${reservation.piso}${reservation.letra}` : 'Disponible - Click para reservar'}
                  >
                    {reservation ? (
                      <div className="reservation-info">
                        <div className="name">
                          {reservation.nombre} {reservation.apellidos}
                        </div>
                        <div className="location">
                          P{reservation.portal} · {reservation.piso}{reservation.letra}
                        </div>
                      </div>
                    ) : (
                      <div className="available-label">Libre</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
