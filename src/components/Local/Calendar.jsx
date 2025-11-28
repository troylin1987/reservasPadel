import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Calendar = ({ onSelectDate }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchReservations = useCallback(async () => {
    try {
      const { year, month } = getDaysInMonth(currentMonth);
      const firstDay = formatDate(new Date(year, month, 1));
      const lastDay = formatDate(new Date(year, month + 1, 0));

      const result = await supabase
        .from('reservas_local')
        .select('*')
        .eq('status', 'activa')
        .gte('fecha', firstDay)
        .lte('fecha', lastDay);

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

  const getReservationForDate = (date) => {
    return reservations.find(r => r.fecha === date);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const isDateInPast = (year, month, day) => {
    const dateToCheck = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  if (loading) return <div className="loading">Cargando calendario</div>;

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header-section">
        <h2>Disponibilidad del Local - {monthNames[month]} {year}</h2>
        <div className="calendar-controls">
          <button onClick={goToPreviousMonth}>← Anterior</button>
          <button onClick={goToCurrentMonth}>Hoy</button>
          <button onClick={goToNextMonth}>Siguiente →</button>
        </div>
      </div>

      <div className="local-calendar-grid">
        <div className="local-calendar-header">
          {dayNames.map(day => (
            <div key={day} className="local-day-name">{day}</div>
          ))}
        </div>

        <div className="local-calendar-days">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="local-day-cell empty"></div>;
            }

            const dateStr = formatDate(new Date(year, month, day));
            const reservation = getReservationForDate(dateStr);
            const isPast = isDateInPast(year, month, day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            return (
              <div
                key={day}
                className={`local-day-cell ${reservation ? 'occupied' : 'available'} ${isPast ? 'past' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => !reservation && !isPast && onSelectDate(dateStr)}
              >
                <div className="day-number">{day}</div>
                {reservation ? (
                  <div className="local-reservation-info">
                    <div className="name">{reservation.nombre} {reservation.apellidos}</div>
                    <div className="location">P{reservation.portal} · {reservation.piso}{reservation.letra}</div>
                  </div>
                ) : !isPast ? (
                  <div className="available-label">Disponible</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="local-calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <span className="legend-color occupied"></span>
          <span>Reservado</span>
        </div>
        <div className="legend-item">
          <span className="legend-color past"></span>
          <span>No disponible</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
