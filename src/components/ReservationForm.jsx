import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';
import { PORTALES, PISOS, LETRAS, generateCancelCode, isDateValid, getEndTime } from '../utils/validators';

const ReservationForm = ({ selectedDate, selectedSlot, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    portal: '',
    piso: '',
    letra: '',
    movil: '',
    correo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Normalizar la letra a mayúsculas automáticamente
    if (name === 'letra') {
      setFormData({
        ...formData,
        [name]: value.toUpperCase()
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const { nombre, apellidos, portal, piso, letra, movil, correo } = formData;
    
    if (!nombre || !apellidos || !portal || !piso || !letra || !movil || !correo) {
      alert('Todos los campos son obligatorios');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert('El correo electrónico no es válido');
      return false;
    }

    const phoneRegex = /^[0-9]{9,}$/;
    if (!phoneRegex.test(movil)) {
      alert('El teléfono móvil debe tener al menos 9 dígitos');
      return false;
    }

    return true;
  };

  const checkExistingReservations = async () => {
    const { portal, piso, letra } = formData;
    
    try {
      const selectedDateObj = new Date(selectedDate + 'T12:00:00');
      
      // Calcular fechas
      const prevDayObj = new Date(selectedDateObj);
      prevDayObj.setDate(prevDayObj.getDate() - 1);
      const prevDayStr = prevDayObj.toISOString().split('T')[0];
      
      const nextDayObj = new Date(selectedDateObj);
      nextDayObj.setDate(nextDayObj.getDate() + 1);
      const nextDayStr = nextDayObj.toISOString().split('T')[0];
      
      // Consultar las 3 fechas de una vez
      const result = await supabase
        .from('reservas')
        .select('*')
        .eq('status', 'activa')
        .in('fecha', [prevDayStr, selectedDate, nextDayStr]);
      
      if (result.error) {
        console.error('Error fetching reservations:', result.error);
        throw new Error('Error al verificar las reservas. Por favor, inténtalo de nuevo.');
      }

      const allReservations = result.data || [];

      // Filtrar las reservas del usuario
      const userReservations = allReservations.filter(r => 
        r.portal === parseInt(portal) &&
        r.piso.toString() === piso.toString() &&
        r.letra.toUpperCase() === letra.toUpperCase()
      );

      // Verificar día anterior
      const prevDayReservation = userReservations.find(r => r.fecha === prevDayStr);
      if (prevDayReservation) {
        const prevDayFormatted = prevDayObj.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
        throw new Error(`No puedes hacer la reserva porque ya tienes una reserva el día anterior (${prevDayFormatted}) a las ${prevDayReservation.hora_inicio}.`);
      }

      // Verificar mismo día
      const todayReservation = userReservations.find(r => r.fecha === selectedDate);
      if (todayReservation) {
        throw new Error(`No puedes hacer la reserva porque ya tienes una reserva hoy a las ${todayReservation.hora_inicio}.`);
      }

      // Verificar día siguiente
      const nextDayReservation = userReservations.find(r => r.fecha === nextDayStr);
      if (nextDayReservation) {
        const nextDayFormatted = nextDayObj.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
        throw new Error(`No puedes hacer la reserva porque ya tienes una reserva el día siguiente (${nextDayFormatted}) a las ${nextDayReservation.hora_inicio}.`);
      }

      // Verificar que el slot específico no esté ocupado por otra persona
      const slotOccupied = allReservations.find(r => 
        r.fecha === selectedDate && 
        r.hora_inicio === selectedSlot
      );

      if (slotOccupied) {
        const isSameUser = 
          slotOccupied.portal === parseInt(portal) &&
          slotOccupied.piso.toString() === piso.toString() &&
          slotOccupied.letra.toUpperCase() === letra.toUpperCase();
        
        if (isSameUser) {
          throw new Error(`No puedes hacer la reserva porque ya tienes una reserva hoy a las ${selectedSlot}.`);
        } else {
          throw new Error('Este horario ya ha sido reservado por otra persona. Por favor, selecciona otro horario.');
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const sendConfirmationEmail = async (cancelCode) => {
    const cancelUrl = `${window.location.origin}${process.env.PUBLIC_URL}/#/cancelar?codigo=${cancelCode}`;
    
    const templateParams = {
      to_email: formData.correo,
      to_name: `${formData.nombre} ${formData.apellidos}`,
      fecha: selectedDate,
      hora: selectedSlot,
      portal: formData.portal,
      piso: formData.piso,
      letra: formData.letra,
      cancel_url: cancelUrl
    };

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!isDateValid(selectedDate)) {
      alert('La fecha seleccionada no es válida. Solo puedes reservar desde hoy hasta 7 días en adelante.');
      return;
    }

    setLoading(true);

    try {
      // Validar reservas existentes
      await checkExistingReservations();

      // Generar código de cancelación
      const cancelCode = generateCancelCode();

      // Insertar reserva en la base de datos
      const { error: insertError } = await supabase
        .from('reservas')
        .insert([{
          fecha: selectedDate,
          hora_inicio: selectedSlot,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          portal: formData.portal,
          piso: formData.piso,
          letra: formData.letra.toUpperCase(),
          movil: formData.movil,
          correo: formData.correo,
          codigo_cancelacion: cancelCode,
          status: 'activa'
        }]);

      if (insertError) {
        console.error('Error inserting reservation:', insertError);
        
        if (insertError.code === '23505') {
          throw new Error('Este horario ya ha sido reservado por otra persona. Por favor, recarga la página y selecciona otro horario.');
        } else {
          throw new Error('Error al crear la reserva en la base de datos. Por favor, inténtalo de nuevo.');
        }
      }

      // Intentar enviar el email de confirmación
      try {
        await sendConfirmationEmail(cancelCode);
        alert('¡Reserva realizada con éxito! Te hemos enviado un email de confirmación.');
        onSuccess();
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        alert('La reserva se ha creado correctamente, pero ha habido un problema enviando el email de confirmación. Tu reserva está confirmada. Código de cancelación: ' + cancelCode);
        onSuccess();
      }

    } catch (error) {
      console.error('Error in reservation process:', error);
      
      if (error.message) {
        alert(error.message);
      } else {
        alert('Error inesperado al procesar la reserva. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-form-container">
      <div className="form-header">
        <h2>Nueva Reserva</h2>
        <button className="close-btn" onClick={onCancel}>✕</button>
      </div>
      
<div className="selected-slot-info">
  <p><strong>Fecha:</strong> {selectedDate}</p>
  <p><strong>Hora:</strong> {selectedSlot} - {getEndTime(selectedSlot)}</p>
</div>

      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Apellidos *</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Portal *</label>
            <select
              name="portal"
              value={formData.portal}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              {PORTALES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Piso *</label>
            <select
              name="piso"
              value={formData.piso}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              {PISOS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Letra *</label>
            <select
              name="letra"
              value={formData.letra}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              {LETRAS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Teléfono Móvil *</label>
          <input
            type="tel"
            name="movil"
            value={formData.movil}
            onChange={handleChange}
            placeholder="600123456"
            required
          />
        </div>

        <div className="form-group">
          <label>Correo Electrónico *</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Reservando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
