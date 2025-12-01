import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Calendar = ({ onSelectDate }) => {
  const [loading, setLoading] = useState(true);
  const [allDates, setAllDates] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNext30Days = useCallback(() => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Todos los días desde mañana hasta 30 días después
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push({
        dateStr: formatDate(date),
        dateObj: date
      });
    }
    return dates;
  }, []);

  const fetchReservations = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Obtener reservas desde hoy hasta dentro de 60 días
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 60);

      const result = await supabase
        .from('reservas_local')
        .select('*')
        .eq('status', 'activa')
        .gte('fecha', formatDate(today))
        .lte('fecha', formatDate(endDate))
        .order('fecha', { ascending: true });

      if (result.error) {
        console.error('Error fetching reservations:', result.error);
      }

      const reservationsData = result.data || [];
      
      // Obtener todos los próximos 30 días
      const next30 = getNext30Days();
      
      // Mapear cada fecha con su reserva (si existe)
      const datesWithReservations = next30.map(({ dateStr, dateObj }) => {
        const reservation = reservationsData.find(r => r.fecha === dateStr);
        return {
          dateStr,
          dateObj,
          reservation: reservation || null,
          isAvailable: !reservation
        };
      });
      
      setAllDates(datesWithReservations);

    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  }, [getNext30Days]);

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

  if (loading) return <div className="loading">Cargando disponibilidad</div>;

  const availableCount = allDates.filter(d => d.isAvailable).length;

  return (
    <div className="local-calendar-list">

      {/* Available Dates Section */}
      <div className="calendar-section">
        <div className="section-header available-header">
          <h3>📅 Fechas Disponibles ({availableCount})</h3>
          <p className="section-subtitle">Mostrando los próximos 30 días</p>
        </div>

        {allDates.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📆</span>
            <p>No hay fechas disponibles</p>
          </div>
        ) : (
          <div className="dates-grid">
            {allDates.map(({ dateStr, dateObj, reservation, isAvailable }) => (
              <div
                key={dateStr}
                className={`date-card ${isAvailable ? 'available' : 'reserved'}`}
                onClick={() => isAvailable && onSelectDate(dateStr)}
                style={{ cursor: isAvailable ? 'pointer' : 'default' }}
              >
                <div className="date-card-header">
                  <div className={`day-number ${!isAvailable ? 'reserved-number' : ''}`}>
                    {dateObj.getDate()}
                  </div>
                  <div className={`status-badge ${isAvailable ? 'available' : 'reserved'}`}>
                    {isAvailable ? 'Disponible' : 'Reservado'}
                  </div>
                </div>
                <div className="date-card-body">
                  <div className="day-name">{getDayName(dateStr)}</div>
                  <div className="date-full">{getFormattedDate(dateStr)}</div>
                </div>
                <div className="date-card-footer">
                  {isAvailable ? (
                    <button className="btn-reserve">Reservar →</button>
                  ) : (
                    <div className="reserved-info">
                      <div className="reserved-name">
                        {reservation.nombre} {reservation.apellidos}
                      </div>
                      <div className="reserved-location">
                        Portal {reservation.portal} · {reservation.piso}{reservation.letra}
                      </div>
                      {reservation.motivo && (
                        <div className="reserved-motivo">
                          "{reservation.motivo}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
