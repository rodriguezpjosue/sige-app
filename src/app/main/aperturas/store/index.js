import { combineReducers } from '@reduxjs/toolkit';
import sesiones from './sesionesSlice';
import sesion from './sesionSlice';
import aperturas from './aperturasSlice';
import alumnos from './alumnosSlice';
import apertura from './aperturaSlice';
import asistencias from './asistenciasSlice';

const reducer = combineReducers({
  sesiones,
  sesion,
  alumnos,
  aperturas,
  apertura,
  asistencias,
});

export default reducer;
