import React from 'react';

const Normativa = () => {
  return (
    <div className="normativa-container">
      <h1>Normativa de la Pista de Pádel</h1>
      <ol className="normativa-list">
        <li>La pista de pádel es de uso exclusivo para los propietarios y residentes de la Comunidad de Vecinos. No está permitido el uso por parte de personas ajenas a la comunidad.</li>
        <li>Las reservas deben realizarse a través del sistema de reservas online habilitado para este fin.</li>
        <li>Cada reserva tiene una duración de 1 hora y 30 minutos.</li>
        <li>Solo se puede realizar una reserva por vivienda al día.</li>
        <li>No se permite hacer reservas en días consecutivos.</li>
        <li>La pista está disponible en los siguientes horarios: 10:00-11:30, 11:30-13:00, 13:00-14:30, 17:00-18:30, 18:30-20:00 y 20:00-21:30.</li>
        <li>Las cancelaciones deben realizarse con al menos 2 horas de antelación utilizando el enlace proporcionado en el correo de confirmación.</li>
        <li>En caso de no presentarse a la reserva sin cancelación previa, se podrá limitar el derecho de reservas futuras.</li>
        <li>Los usuarios deben mantener la pista en buen estado y recoger sus pertenencias al finalizar.</li>
        <li>Está prohibido fumar en la pista de pádel.</li>
        <li>Los niños menores de 12 años deben estar siempre acompañados por un adulto responsable.</li>
        <li>No se permite la entrada de animales en las instalaciones deportivas.</li>
        <li>El uso de la pista implica la aceptación de estas normas. El incumplimiento puede resultar en la suspensión temporal o permanente del derecho de reserva.</li>
      </ol>
    </div>
  );
};

export default Normativa;
