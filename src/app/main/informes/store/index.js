import { combineReducers } from '@reduxjs/toolkit';
import tiposreunion from './tiposreunionSlice';
import informes from './informesSlice';
import integrantes from './integrantesSlice';
import informe from './informeSlice';

const reducer = combineReducers({
  tiposreunion,
  integrantes,
  informes,
  informe,
});

export default reducer;
