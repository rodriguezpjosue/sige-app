import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';
import StringOperations from '../../../shared-components/stringOperations';
import sigeServiceConfig from '../../../auth/services/sigeService/sigeServiceConfig';
import { getAsistencias } from './asistenciaSlice';

export const getSesion = createAsyncThunk(
  'aperturasApp/task/getSesion',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        sigeServiceConfig.uniqueEndpoint,
        {
          params: {
            endpoint: 'search_read',
            args: {
              sid: window.localStorage.getItem('session_id'), // session_id
              model: 'sige.apertura.sesiones',
              filter: `[('id', '=',  ${id})]`, // red_id
              fields:
                "['id', 'name', 'tema_programacion', 'state', 'fecha', 'sesion_recuperacion', 'alumno_asistencia']",
            },
          },
        },
        {
          withCredentials: true,
        }
      );

      const data = await response.data;
      const sesion = data.result.data[0];
      if (sesion.alumno_asistencia.length > 0) {
        const asistenciaAlumnosIds = sesion.alumno_asistencia.map((asistencia) => asistencia.id);
        dispatch(getAsistencias(asistenciaAlumnosIds)).then((res) => {
          sesion.alumno_asistencia = res.payload;
          return sesion;
        });
      }
      return sesion;
    } catch (error) {
      history.push({ pathname: `/aperturas/sesiones/${id}` });
      return null;
    }
  }
);

export const getSesiones = createAsyncThunk(
  'aperturasApp/task/getSesiones',
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
              model: 'sige.apertura.sesiones',
              filter: JSON.stringify(filtro),
              fields:
                "['id', 'name', 'tema_programacion', 'state', 'fecha', 'sesion_recuperacion', 'alumno_asistencia']",
            },
          },
        },
        {
          withCredentials: true,
        }
      );

      const data = await response.data;
      const sesiones = data.result.data;
      return sesiones;
    } catch (error) {
      history.push({ pathname: `/aperturas` });
      return null;
    }
  }
);

export const updateSesion = createAsyncThunk(
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
            fields:
              "['id', 'name', 'tema_programacion', 'state', 'fecha', 'sesion_recuperacion', 'alumno_asistencia']",
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

export const cerrarSesion = createAsyncThunk(
  'aperturasApp/aperturas/cerrarSesion',
  async (sesionId, { dispatch, getState }) => {
    const response = await axios.post(
      sigeServiceConfig.uniqueEndpoint,
      {
        params: {
          endpoint: 'exec_workflow',
          args: {
            sid: window.localStorage.getItem('session_id'), // session_id
            model: 'sige.apertura.sesiones',
            id: sesionId,
            method: 'boton_pendiente',
            fields:
              "['id', 'name', 'tema_programacion', 'state', 'fecha', 'sesion_recuperacion', 'alumno_asistencia']",
          },
        },
      },
      {
        withCredentials: true,
      }
    );

    const data = await response.data;
    let mensaje = ``;
    let variante = ``;
    if (data.result.status === 200) {
      mensaje = 'El informe ha sido enviado para su proceso en la Oficina de Redes.';
      variante = 'success';
    } else {
      mensaje = 'Hubo un error al procesar el informe.';
      variante = 'error';
    }
    dispatch(showMessage({ message: mensaje, variant: variante }));
    const informeEdited = data.result.data;
    const asistentesIds = informeEdited.asistentes_ids;
    informeEdited.asistentes_ids = asistentesIds.map((asistente) => asistente.id);
    const fechareunion = StringOperations.getLocaleDateTime(informeEdited.fechareunion);
    informeEdited.fechareunion = StringOperations.setDateTimeString(fechareunion);
    return informeEdited;
  }
);

export const selectSesion = ({ aperturasApp }) => aperturasApp.sesion;

const sesionSlice = createSlice({
  name: 'aperturasApp/sesion',
  initialState: null,
  reducers: {
    resetSesion: () => null,
  },
  extraReducers: {
    [getSesion.pending]: (state, action) => null,
    [getSesion.fulfilled]: (state, action) => action.payload,
    [updateSesion.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetSesion } = sesionSlice.actions;

export default sesionSlice.reducer;
