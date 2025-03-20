import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';

const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Obtener la sesión del usuario
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpiar la suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, []);

  // Si no hay usuario autenticado, redirigir a la página de inicio de sesión
  return session ? children : <Navigate to="/" />;
};

export default PrivateRoute;