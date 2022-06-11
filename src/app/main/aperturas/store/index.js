import { combineReducers } from '@reduxjs/toolkit';
import tiposreunion from './sesionesSlice';
import informes from './aperturasSlice';
import integrantes from './alumnosSlice';
import informe from './aperturaSlice';

const reducer = combineReducers({
  tiposreunion,
  integrantes,
  informes,
  informe,
});

export default reducer;
