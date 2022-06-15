import { combineReducers } from '@reduxjs/toolkit';
import sesiones from './sesionesSlice';
import sesion from './sesionSlice';
import aperturas from './aperturasSlice';
import alumnos from './alumnosSlice';
import apertura from './aperturaSlice';

const reducer = combineReducers({
  sesiones,
  sesion,
  alumnos,
  aperturas,
  apertura,
});

export default reducer;
