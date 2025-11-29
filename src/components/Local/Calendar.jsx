import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Calendar = ({ onSelectDate }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNext30Days = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Solo fechas desde mañana hasta 30 días después
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push({
        dateStr: formatDate(date),
        dateObj: date
      });
    }
    return dates;
  };

  const fetchReservations = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Obtener reservas desde hace 60 días hasta dentro de 60 días
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 60);
      
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 60);

      const result = await supabase
        .from('reservas_local')
        .select('*')
        .eq('status', 'activa')
        .gte('fecha', formatDate(startDate))
        .lte('fecha', formatDate(endDate))
        .order('fecha', { ascending: true });

      if (result.error) {
        console.error('Error fetching reservations:', result.error);
      }

      setReservations(result.data || []);
      
      // Calcular fechas disponibles
      const next30 = getNext30Days();
      const reserved = (result.data || []).map(r => r.fecha);
      
      const available = next30.filter(({ dateStr }) => !reserved.includes(dateStr));
      setAvailableDates(available);

    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const getDayName = (dateStr) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const date = new Date(dateStr + 'T12:00:00');
    return days[date.getDay()];
  };

  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const getReservationForDate = (dateStr) => {
    return reservations.find(r => r.fecha === dateStr);
  };

  if (loading) return <div className="loading">Cargando disponibilidad</div>;

  const upcomingReservations = reservations.filter(r => {
    const resDate = new Date(r.fecha + 'T12:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return resDate >= today;
  });

  return (
    <div className="local-calendar-list">
      {/* Available Dates Section */}
      <div className="calendar-section">
        <div className="section-header available-header">
          <h3>📅 Fechas Disponibles ({availableDates.length})</h3>
          <p className="section-subtitle">Próximos 30 días disponibles para reservar</p>
        </div>

        {availableDates.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📆</span>
            <p>No hay fechas disponibles en los próximos 30 días</p>
          </div>
        ) : (
          <div className="dates-grid">
            {availableDates.map(({ dateStr, dateObj }) => (
              <div
                key={dateStr}
                className="date-card available"
                onClick={() => onSelectDate(dateStr)}
              >
                <div className="date-card-header">
                  <div className="day-number">{dateObj.getDate()}</div>
                  <div className="status-badge available">Disponible</div>
                </div>
                <div className="date-card-body">
                  <div className="day-name">{getDayName(dateStr)}</div>
                  <div className="date-full">{getFormattedDate(dateStr)}</div>
                </div>
                <div className="date-card-footer">
                  <button className="btn-reserve">Reservar →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Reservations Section */}
      {upcomingReservations.length > 0 && (
        <div className="calendar-section">
          <div className="section-header reserved-header">
            <h3>🔒 Próximas Reservas ({upcomingReservations.length})</h3>
            <p className="section-subtitle">Fechas ya reservadas</p>
          </div>

          <div className="reservations-list">
            {upcomingReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-date-block">
                  <div className="res-day-number">
                    {new Date(reservation.fecha + 'T12:00:00').getDate()}
                  </div>
                  <div className="res-month">
                    {new Date(reservation.fecha + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short' })}
                  </div>
                </div>
                <div className="reservation-details">
                  <div className="res-day-name">{getDayName(reservation.fecha)}</div>
                  <div className="res-full-date">{getFormattedDate(reservation.fecha)}</div>
                  <div className="res-user">
                    <strong>{reservation.nombre} {reservation.apellidos}</strong>
                    <span className="res-location">Portal {reservation.portal} · {reservation.piso}{reservation.letra}</span>
                  </div>
                  {reservation.motivo && (
                    <div className="res-motivo">"{reservation.motivo}"</div>
                  )}
                </div>
                <div className="status-badge reserved">Reservado</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="calendar-info">
        <div className="info-box">
          <strong>ℹ️ Información importante:</strong>
          <ul>
            <li>Solo puedes reservar <strong>desde mañana hasta 30 días</strong> en adelante</li>
            <li>Máximo <strong>1 reserva al mes</strong> por vivienda</li>
            <li>No se permite reservar <strong>30 días antes o después</strong> de tu última reserva</li>
            <li>Horario del local: <strong>10:00 a 22:00</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
