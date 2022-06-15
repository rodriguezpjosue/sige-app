import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';
import StringOperations from '../../../shared-components/stringOperations';
import sigeServiceConfig from '../../../auth/services/sigeService/sigeServiceConfig';

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
              fields: "['id', 'name', 'seleccion_asistencia']",
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

export const getAsistencias = createAsyncThunk(
  'aperturasApp/task/getAsistencias',
  async (ids, { dispatch, getState }) => {
    const filtro = [['id', 'in', ids]];
    try {
      const response = await axios.post(
        sigeServiceConfig.uniqueEndpoint,
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'),
              model: 'sige.alumno_asistencia_sesion',
              filter: JSON.stringify(filtro),
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
      return null;
    }
  }
);

export const updateAsistencia = createAsyncThunk(
  'aperturasApp/aperturas/updateSesion',
  async (sesion, { dispatch, getState }) => {
    sesion.alumno_asistencia = [[6, 0, sesion.alumno_asistencia]];
    if (sesion.fecha) {
      sesion.fecha = sesion.fecha.toISOString().replace('T', ' ').replace('Z', '');
    }
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'write',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.apertura.sesiones',
            id: sesion.id,
            vals: sesion,
            fields: "['id', 'name', 'tema_programacion', 'state', 'fecha', 'sesion_recuperacion', 'alumno_asistencia']",
          },
        },
      },
      {
        withCredentials: true,
      }
    );

    const informeData = await response.data;
    const { status, data } = informeData.result;
    let mensaje = ``;
    let variante = ``;
    if (status === 200) {
      mensaje = 'Informe actualizado satisfactoriamente.';
      variante = 'success';
    } else {
      mensaje = 'Hubo un error al actualizar el informe.';
      variante = 'error';
    }
    const asistentesIds = data.asistentes_ids;
    data.asistentes_ids = asistentesIds.map((asistente) => asistente.id);
    const fechareunion = StringOperations.getLocaleDateTime(data.fechareunion);
    data.fechareunion = StringOperations.setDateTimeString(fechareunion);
    data.tiporeunion_id = data.tiporeunion_id[0].id;
    dispatch(showMessage({ message: mensaje, variant: variante }));
    return data;
  }
);

export const selectAsistencia = ({ aperturasApp }) => aperturasApp.asistencia;

const asistenciaSlice = createSlice({
  name: 'aperturasApp/asistencia',
  initialState: null,
  reducers: {
    resetSesion: () => null,
  },
  extraReducers: {
    [getAsistencia.pending]: (state, action) => null,
    [getAsistencia.fulfilled]: (state, action) => action.payload,
    [getAsistencias.pending]: (state, action) => null,
    [getAsistencias.fulfilled]: (state, action) => action.payload,
    [updateAsistencia.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetAsistencia } = asistenciaSlice.actions;

export default asistenciaSlice.reducer;
