import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import AddExercise from './components/AddExercise';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/week"
        element={
          <PrivateRoute>
            <WeekView />
          </PrivateRoute>
        }
      />
      <Route
        path="/day/:day"
        element={
          <PrivateRoute>
            <DayView />
          </PrivateRoute>
        }
      />
      <Route
        path="/day/:day/add-exercise"
        element={
          <PrivateRoute>
            <AddExercise />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} /> {/* Ruta por defecto */}
    </Routes>
  );
};

export default App;