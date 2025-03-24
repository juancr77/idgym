import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AddExercise = () => {
  const { day } = useParams();
  const [exerciseName, setExerciseName] = useState('');
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setUploadProgress(0);

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
            .upload(filePath, video, {
              cacheControl: '3600',
              upsert: false,
              onProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setUploadProgress(progress);
              },
            });

          if (error) throw error;

          const { data } = supabase.storage
            .from('videos')
            .getPublicUrl(filePath);

          return data.publicUrl;
        })
      );

      // Obtener el ID del usuario autenticado
      const user_id = session.user.id;

      // Insertar el ejercicio con el user_id
      const { error } = await supabase
        .from('exercises')
        .insert([{ name: exerciseName, day: day, videos: videoURLs, user_id }]);

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
        {uploading && (
          <div>
            <p>Subiendo: {uploadProgress}%</p>
            <progress value={uploadProgress} max="100" />
          </div>
        )}
        <button type="submit" disabled={uploading}>
          {uploading ? 'Subiendo...' : 'Agregar Ejercicio'}
        </button>
      </form>
    </div>
  );
};

export default AddExercise;