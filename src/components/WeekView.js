import React from 'react';
import { Link } from 'react-router-dom';

const WeekView = () => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div>
      <h1>Semana de Ejercicios</h1>
      <div>
        {days.map((day, index) => (
          <Link key={index} to={`/day/${day}`}>
            <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
              {day}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WeekView;