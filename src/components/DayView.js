import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const DayView = () => {
  const { day } = useParams();
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();

  // Cargar ejercicios del día
  useEffect(() => {
    const fetchExercises = async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('day', day);

      if (error) console.error('Error al cargar ejercicios:', error);
      else setExercises(data);
    };

    fetchExercises();
  }, [day]);

  return (
    <div>
      <h1>{day}</h1>
      <button onClick={() => navigate(`/day/${day}/add-exercise`)}>Agregar Ejercicio</button>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            {exercise.name}
            <ul>
              {exercise.videos.map((video, index) => (
                <li key={index}>
                  <a href={video} target="_blank" rel="noopener noreferrer">Ver Video {index + 1}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/week')}>Volver a la Semana</button>
    </div>
  );
};

export default DayView;