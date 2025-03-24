import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const DayView = () => {
  const { day } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('day', day);

        if (error) throw error;
        setExercises(data);
      } catch (error) {
        console.error('Error al cargar ejercicios:', error.message);
        setError('Error al cargar los ejercicios. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [day]);

  return (
    <div>
      <h1>{day}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => navigate(`/day/${day}/add-exercise`)}>Agregar Ejercicio</button>
      <button onClick={() => navigate('/week')}>Volver a la Semana</button>

      {loading ? (
        <p>Cargando ejercicios...</p>
      ) : exercises.length === 0 ? (
        <p>No hay ejercicios para este día.</p>
      ) : (
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <h3>{exercise.name}</h3>
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
      )}
    </div>
  );
};

export default DayView;