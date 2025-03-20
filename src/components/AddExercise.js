import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AddExercise = () => {
  const { day } = useParams();
  const [exerciseName, setExerciseName] = useState('');
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files); // Convertir FileList a Array
    setVideos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      // Verificar que el usuario esté autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Debes iniciar sesión para agregar ejercicios.');
      }

      // Verificar que se haya ingresado un nombre y al menos un video
      if (!exerciseName || videos.length === 0) {
        throw new Error('Por favor, ingresa un nombre y selecciona al menos un video.');
      }

      // Subir cada video a Supabase Storage
      const videoURLs = await Promise.all(
        videos.map(async (video) => {
          const filePath = `exercises/${Date.now()}_${video.name}`;
          const { error } = await supabase.storage
            .from('videos')
            .upload(filePath, video);

          if (error) throw error;

          // Obtener la URL del video
          const { data } = supabase.storage
            .from('videos')
            .getPublicUrl(filePath);

          return data.publicUrl;
        })
      );

      // Guardar el ejercicio en la base de datos
      const { error } = await supabase
        .from('exercises')
        .insert([{ name: exerciseName, day: day, videos: videoURLs }]);

      if (error) throw error;

      // Redirigir a la vista del día después de agregar el ejercicio
      navigate(`/day/${day}`);
    } catch (error) {
      console.error('Error al agregar el ejercicio:', error);
      setError(error.message); // Mostrar mensaje de error al usuario
    } finally {
      setUploading(false); // Desactivar el estado de carga
    }
  };

  return (
    <div>
      <h1>Agregar Ejercicio para {day}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar mensaje de error */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del ejercicio"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
        />
        <input
          type="file"
          multiple
          onChange={handleVideoChange}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Subiendo...' : 'Agregar Ejercicio'}
        </button>
      </form>
    </div>
  );
};

export default AddExercise;