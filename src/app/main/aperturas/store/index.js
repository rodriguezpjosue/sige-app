import { combineReducers } from '@reduxjs/toolkit';
import sesiones from './sesionesSlice';
import sesion from './sesionSlice';
import aperturas from './aperturasSlice';
import alumnos from './alumnosSlice';
import apertura from './aperturaSlice';
import asistencias from './asistenciasSlice';
import asistencia from './asistenciaSlice';

const reducer = combineReducers({
  sesiones,
  sesion,
  alumnos,
  aperturas,
  apertura,
  asistencias,
  asistencia,
});

export default reducer;
