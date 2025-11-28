import React from 'react';

const Normativa = () => {
  return (
    <div className="normativa-container">
      <h1>Normativa del Local de la Comunidad</h1>
      
      <h2>Normas Generales de Reserva</h2>
      <ol className="normativa-list">
        <li>Solicitud de Reserva: La reserva del local debe realizarse con una antelación mínima y mediante la plataforma habilitada para ello.</li>
        <li>Prioridad de Uso: La reserva será concedida por orden de solicitud. En el caso de eventos comunitarios o reuniones, tendrán prioridad.</li>
        <li>Duración: El local podrá reservarse un máximo de un día al mes, para garantizar su disponibilidad a todos los propietarios. El local no se puede utilizar antes de las 10:00h y debe quedar cerrado y recogido a las 22:00h.</li>
        <li>Confirmación de la Reserva: La reserva no será válida hasta que se reciba la confirmación por correo electrónico.</li>
        <li>Cancelaciones: Las cancelaciones deberán realizarse con un mínimo de 24 horas de antelación. De no hacerlo, se podría limitar el derecho de reservas futuras.</li>
        <li>No se permite la entrada de animales en las instalaciones.</li>
        <li>Aquellos usuarios que no cumplan la normativa o hagan un mal uso de la instalación, serán sancionados.</li>
      </ol>

      <h2>Normas para el Cuidado del Local</h2>
      <ol className="normativa-list">
        <li>Estado del Local: El local deberá dejarse en las mismas condiciones de limpieza y orden en las que se encontró. Cualquier mobiliario o equipo que haya en él deberá ser dejado en su sitio tal y como estaba, de forma ordenada.</li>
        <li>Limpieza: El uso del local implica la limpieza posterior por parte del usuario. Si se encuentran desperfectos o suciedad en exceso tras su uso, se podrá aplicar una sanción o cobrar un coste adicional por limpieza.</li>
        <li>Basura: La basura generada durante el uso del local deberá retirarse completamente. No se puede dejar basura dentro del local o áreas comunes.</li>
        <li>Prohibición de Alteraciones: No se permite hacer modificaciones temporales o permanentes en el local (pintar, colgar cuadros, etc.).</li>
        <li>Mantenimiento del local: En caso de mal uso o daño, el usuario será responsable de los costes de reparación o reposición.</li>
      </ol>

      <h2>Normas sobre Responsabilidades</h2>
      <ol className="normativa-list">
        <li>Responsabilidad por Daños: El usuario es responsable de los daños ocasionados en el local o sus instalaciones durante el periodo de uso. Los costes de reparación o reposición serán asumidos por el usuario que haya reservado el espacio.</li>
        <li>Aforo Máximo: El número de personas en el local no debe superar el aforo permitido. En caso de eventos, es obligatorio cumplir con las normativas de seguridad establecidas.</li>
        <li>Respeto a la Normativa: Durante el uso del local, se deben respetar las normativas de convivencia de la comunidad (horarios de silencio, uso adecuado de espacios comunes, etc.).</li>
        <li>Eventos Privados: Está prohibido el uso del local para eventos comerciales o que generen molestias al resto de los vecinos (ruido, exceso de personas, etc.). Los eventos privados deberán ser acordes al uso permitido del local.</li>
        <li>Supervisión: Si el usuario es menor de edad, deberá estar acompañado de un adulto responsable en todo momento durante el uso del local.</li>
      </ol>

      <h2>Normas sobre Seguridad</h2>
      <ol className="normativa-list">
        <li>Control de Accesos: El acceso al local deberá realizarse con las llaves o códigos suministrados por la comunidad. Está prohibido ceder el acceso a personas ajenas sin autorización.</li>
        <li>Cierre del Local: El usuario del local deberá asegurarse de cerrar correctamente puertas y ventanas, así como apagar luces y equipos electrónicos.</li>
        <li>Emergencias: En caso de situaciones de emergencia (incendios, daños graves, etc.), se deberá notificar inmediatamente a la junta de propietarios o al administrador de la comunidad.</li>
        <li>Siempre deberá haber un propietario responsable en el local, no pueden estar haciendo uso del mismo únicamente invitados.</li>
      </ol>
    </div>
  );
};

export default Normativa;
