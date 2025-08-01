import React from 'react';
import Calendar from 'react-calendar';
import '../css/Calendario.css'


function MyCalendarComponent({ setDataSelecionada }) {
  const handleDateChange = (value) => {
    
    if (value instanceof Date && !isNaN(value)) {
      const dataFormatada = value.toISOString().slice(0, 10);
      setDataSelecionada(dataFormatada);
    }
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
      />
    </div>
  );
}
export default MyCalendarComponent;