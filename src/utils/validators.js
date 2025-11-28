export const SLOTS = [
  '10:00', '11:30', '13:00', '17:00', '18:30', '20:00'
];

export const PORTALES = [4, 5, 6, 7, 8];

export const PISOS = ['Bajo', '1', '2', '3', '4', '5', 'Ático'];

export const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const generateCancelCode = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const isDateValid = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 7);
  
  const selectedDate = new Date(dateStr);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate >= today && selectedDate <= maxDate;
};

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getNext7Days = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

// Función para calcular la hora de fin de un slot
export const getEndTime = (startTime) => {
  const endTimes = {
    '10:00': '11:30',
    '11:30': '13:00',
    '13:00': '14:30',
    '17:00': '18:30',
    '18:30': '20:00',
    '20:00': '21:30'
  };
  return endTimes[startTime] || '';
};
