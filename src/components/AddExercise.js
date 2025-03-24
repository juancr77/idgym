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
    const files = Array.from(e.target.files);
    setVideos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Debes iniciar sesión para agregar ejercicios.');
      }

      if (!exerciseName || videos.length === 0) {
        throw new Error('Por favor, ingresa un nombre y selecciona al menos un video.');
      }

      const videoURLs = await Promise.all(
        videos.map(async (video) => {
          const filePath = `exercises/${Date.now()}_${video.name}`;
          const { error } = await supabase.storage
            .from('videos')
            .upload(filePath, video);

          if (error) throw error;

          const { data } = supabase.storage
            .from('videos')
            .getPublicUrl(filePath);

          return data.publicUrl;
        })
      );

      const { error } = await supabase
        .from('exercises')
        .insert([{ name: exerciseName, day: day, videos: videoURLs }]);

      if (error) throw error;

      navigate(`/day/${day}`);
    } catch (error) {
      console.error('Error al agregar el ejercicio:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Agregar Ejercicio para {day}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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