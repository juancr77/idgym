import React from 'react';
import { createRoot } from 'react-dom/client'; // Para React 18
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Selecciona el contenedor raíz
const container = document.getElementById('root');

// Crea una raíz
const root = createRoot(container);

// Renderiza la aplicación
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);