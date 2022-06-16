import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import sigeServiceConfig from '../../../auth/services/sigeService/sigeServiceConfig';

export const getAsistencias = createAsyncThunk(
  'aperturasApp/task/getAsistencias',
  async (sesionId, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        sigeServiceConfig.uniqueEndpoint,
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'), // session_id
              model: 'sige.alumno_asistencia_sesion',
              filter: `[('session_id', '=',  ${sesionId})]`, // red_id
              fields: "['id', 'name', 'seleccion_asistencia']",
            },
          },
        },
        {
          withCredentials: true,
        }
      );

      const data = await response.data;
      const asistencias = data.result.data;
      return asistencias;
    } catch (error) {
      history.push({ pathname: `/aperturas` });
      return [];
    }
  }
);

export const selectAsistencias = ({ aperturasApp }) => aperturasApp.asistencias;

const asistenciasSlice = createSlice({
  name: 'aperturasApp/asistencias',
  initialState: [],
  reducers: {
    resetAsistencias: () => [],
  },
  extraReducers: {
    [getAsistencias.pending]: (state, action) => state.asistencias,
    [getAsistencias.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetAsistencias } = asistenciasSlice.actions;

export default asistenciasSlice.reducer;
