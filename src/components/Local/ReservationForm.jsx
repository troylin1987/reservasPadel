import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import emailjs from '@emailjs/browser';
import { PORTALES, PISOS, LETRAS, generateCancelCode } from '../../utils/validators';

const ReservationForm = ({ selectedDate, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    portal: '',
    piso: '',
    letra: '',
    movil: '',
    correo: '',
    motivo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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
    const { nombre, apellidos, portal, piso, letra, movil, correo, motivo } = formData;
    
    if (!nombre || !apellidos || !portal || !piso || !letra || !movil || !correo || !motivo) {
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
      const currentMonth = selectedDateObj.getMonth();
      const currentYear = selectedDateObj.getFullYear();
      
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];
      const lastDayStr = lastDayOfMonth.toISOString().split('T')[0];
      
      const result = await supabase
        .from('reservas_local')
        .select('*')
        .eq('status', 'activa')
        .gte('fecha', firstDayStr)
        .lte('fecha', lastDayStr);
      
      if (result.error) {
        console.error('Error fetching reservations:', result.error);
        throw new Error('Error al verificar las reservas. Por favor, inténtalo de nuevo.');
      }

      const allReservations = result.data || [];

      // Verificar que el usuario no tenga ya una reserva este mes
      const userReservation = allReservations.find(r => 
        r.portal === parseInt(portal) &&
        r.piso.toString() === piso.toString() &&
        r.letra.toUpperCase() === letra.toUpperCase()
      );

      if (userReservation) {
        const reservedDate = new Date(userReservation.fecha + 'T12:00:00').toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        throw new Error(`Ya tienes una reserva este mes (${reservedDate}). Solo se permite una reserva al mes por vivienda.`);
      }

      // Verificar que el día específico no esté ocupado
      const dayOccupied = allReservations.find(r => r.fecha === selectedDate);

      if (dayOccupied) {
        throw new Error('Este día ya ha sido reservado por otro vecino. Por favor, selecciona otra fecha.');
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
      tipo_reserva: 'Local Comunitario',
      horario: '10:00 - 22:00',
      portal: formData.portal,
      piso: formData.piso,
      letra: formData.letra,
      motivo: formData.motivo,
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

    setLoading(true);

    try {
      await checkExistingReservations();

      const cancelCode = generateCancelCode();

      const { error: insertError } = await supabase
        .from('reservas_local')
        .insert([{
          fecha: selectedDate,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          portal: formData.portal,
          piso: formData.piso,
          letra: formData.letra.toUpperCase(),
          movil: formData.movil,
          correo: formData.correo,
          motivo: formData.motivo,
          codigo_cancelacion: cancelCode,
          status: 'activa'
        }]);

      if (insertError) {
        console.error('Error inserting reservation:', insertError);
        
        if (insertError.code === '23505') {
          throw new Error('Este día ya ha sido reservado. Por favor, recarga la página y selecciona otra fecha.');
        } else {
          throw new Error('Error al crear la reserva en la base de datos. Por favor, inténtalo de nuevo.');
        }
      }

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
        <h2>Reserva del Local Comunitario</h2>
        <button className="close-btn" onClick={onCancel}>✕</button>
      </div>
      
      <div className="selected-slot-info">
        <p><strong>Fecha:</strong> {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}</p>
        <p><strong>Horario:</strong> 10:00 - 22:00 (Día completo)</p>
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

        <div className="form-group">
          <label>Motivo de la reserva *</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            placeholder="Describe brevemente el motivo de tu reserva..."
            rows="3"
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
