import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';
import StringOperations from '../../../shared-components/stringOperations';
import sigeServiceConfig from '../../../auth/services/sigeService/sigeServiceConfig';
import { getAsistencias } from './asistenciasSlice';

export const getAsistencia = createAsyncThunk(
  'aperturasApp/task/getAsistencia',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        sigeServiceConfig.uniqueEndpoint,
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'), // session_id
              model: 'sige.alumno_asistencia_sesion',
              filter: `[('id', '=',  ${id})]`, // red_id
              fields: "['id', 'name', 'seleccion_asistencia', 'session_id']",
            },
          },
        },
        {
          withCredentials: true,
        }
      );

      const data = await response.data;
      const apertura = data.result.data[0];
      return apertura;
    } catch (error) {
      history.push({ pathname: `/aperturas` });
      return null;
    }
  }
);

export const updateAsistencia = createAsyncThunk(
  'aperturasApp/aperturas/updateAsistencia',
  async (asistencia, { dispatch, getState }) => {
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'write',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.alumno_asistencia_sesion',
            id: asistencia.id,
            vals: asistencia,
            fields: "['id', 'name', 'seleccion_asistencia', 'session_id']",
          },
        },
      },
      {
        withCredentials: true,
      }
    );

    const asistenciaData = await response.data;
    const { status, data } = asistenciaData.result;
    if (status === 200) {
      dispatch(getAsistencias(data.session_id[0].id)).then((res) => {
        return data;
      });
    } else {
      return null;
    }
  }
);

export const selectAsistencia = ({ aperturasApp }) => aperturasApp.asistencia;

const asistenciaSlice = createSlice({
  name: 'aperturasApp/asistencia',
  initialState: null,
  reducers: {
    resetAsistencia: () => null,
  },
  extraReducers: {
    [getAsistencia.pending]: (state, action) => null,
    [getAsistencia.fulfilled]: (state, action) => action.payload,
    [updateAsistencia.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetAsistencia } = asistenciaSlice.actions;

export default asistenciaSlice.reducer;
